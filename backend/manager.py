from logging import Manager
from anomaly_detection.regression_detector import RegressionAnomalyDetector
from anomaly_detection.hybrid_detector import HybridAnomalyDetector
from . import db_manager
import datetime
import random

# maps algorithm name to its detector class
ALGORITHMS = {"regression": RegressionAnomalyDetector, "hybrid": HybridAnomalyDetector}
DB_PATH = "db/modeldb.fs"
MAX_ITEMS = 10**8

class ModelsManager:
    """a class for handling all saved models"""

    def __init__(self):
        self._models = dict() # maps id is to its model
        self._detectors = dict() # maps id is to its detector
        
        self._db = db_manager.DBManager(DB_PATH)

        # init id_set
        models = self._db.get_models_info()
        self._id_set = set()
        for model in models:
            self._models[model['model_id']] = model
            self._id_set.add(model['model_id'])
        

    def _current_time(self):
        """get current time in the format of YYYY-MM-DDTHH:mm:ssZ"""
        now = datetime.datetime.now()
        return now.strftime('%Y-%m-%dT%X%z')

    def _choose_id(self):
        while True:
            try_id = random.randint(0, MAX_ITEMS)
            if try_id not in self._id_set:
                self._id_set.add(try_id)
                return try_id

    def add_model(self, algorithm, data):
        """train a model and add it to the list of existing models

        Args:
            data (dictionary: string -> list of floats): a normal timeseries to learn from, maps a feature name to its column values
            algorithm (string): the name of the algorithm to train from

        Returns:
            Model: the model, or None if something failed
        """

        if algorithm not in ALGORITHMS:
            raise Exception('algoritm does not exist')

        detector = ALGORITHMS[algorithm](data)
        detector.learn_normal()

        model_id = self._choose_id()
        self._detectors[model_id] = detector
        model = dict(model_id=model_id, upload_time=self._current_time(), status='ready')
        self._models[model_id] = model

        # save model to database
        self._db.add_model(model_id, (detector, model))
        
        return self._models[model_id]

    def get_model(self, id):
        """return a model by its id"""
        if id not in self._models:
            raise Exception(f'model with the id {id} does not exist')
        return self._models[id]

    def get_all_models(self):
        """
        Returns:
            list of Models: list of all models
        """
        return list(self._models.values())

    def delete_model(self, id):
        """delete a model by its id"""
        if id not in self._models:
            raise Exception(f'model with the id {id} does not exist')

        self._models.pop(id, None)
        self._detectors.pop(id, None)
        self._db.delete_model(id)


    def detect_anomalies(self, model_id, data):
        """detect anomalies wuth a certain model

        Args:
            id (int): model_is of the model to detect with
            data (dictionary, maps string to list of floats): timeseries data to detect anomalies in

        Returns:
            None if model is not ready yet or report with all anomalies, in the format:
            { anomalies:{ col_name_1: [span_1], col_name_2: [span_1,span_2, ... ] ....},reason: Any} }
        """
        if model_id not in self._models:
            raise Exception(f'model with the id {model_id} does not exist')

        if self._models[model_id]['status'] == 'pending':
            return None
            
        if model_id in self._detectors:
            det = self._detectors[model_id]
        else:
            det, _ = self._db.get_model(model_id)
            self._detectors[model_id] = det
            
        anomalies = det.detect(data)
        report = {}

        # transform list of indexes to list of spans
        for feature in data:
            report[feature] = []
            feature_anomalies = anomalies[feature]

            if len(feature_anomalies) == 0:
                continue

            i = 0
            span_start = feature_anomalies[i]
            span_end = span_start
            while i < len(feature_anomalies) - 1:
                i += 1
                if feature_anomalies[i] == span_end + 1:
                    span_end += 1
                else:
                    report[feature].append([span_start, span_end])
                    span_start = feature_anomalies[i]
                    span_end = span_start

            report[feature].append([span_start, span_end])
            
        return dict(anomalies=report, reason=det.get_model())
    
    def close(self):
        """ release resources
        """
        self._db.close()
        