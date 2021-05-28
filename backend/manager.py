from logging import Manager
from anomaly_detection.regression_detector import RegressionAnomalyDetector
from anomaly_detection.hybrid_detector import HybridAnomalyDetector
from . import db_manager

# maps algorithm name to its detector class
ALGORITHMS = {"regression": RegressionAnomalyDetector, "hybrid": HybridAnomalyDetector}
DB_PATH = "db\modeldb.fs"

class ModelsManager:
    """a class for handling all saved models"""

    def __init__(self):
        self._models = {} # maps id is to its model
        self._detectors = {} # maps id is to its detector
        self._current_max_id = 0
        self._db = db_manager.DBManager(DB_PATH)


    def add_model(self, algorithm, data):
        """train a model and add it to the list of existing models

        Args:
            data (dictionary: string -> list of floats): a normal timeseries to learn from, maps a feature name to its column values
            algorithm (string): the name of the algorithm to train from

        Returns:
            Model: the model, or None if something failed
        """

        if algorithm not in ALGORITHMS:
            return None

        detector = ALGORITHMS[algorithm](data)
        detector.learn_normal()

        self._current_max_id += 1
        self._detectors[self._current_max_id] = detector
        model = dict(model_id=self._current_max_id, upload_time='YYYY-MM-DDTHH:mm:ssZ', status='ready')
        self._models[self._current_max_id] = model

        # save model to database
        self._db.add_model(self._current_max_id, (detector, model))
        
        return self._models[self._current_max_id]

    def get_model(self, id):
        """return a model by its id"""
        return self._models[id]

    def get_all_models(self):
        """
        Returns:
            list of Models: list of all models
        """
        return self._db.get_models_info()
        #return list(self._models.values())

    def delete_model(self, id):
        """delete a model by its id"""
        self._models.pop(id)
        self._detectors.pop(id)

    def detect_anomalies(self, id, data):
        """detect anomalies wuth a certain model

        Args:
            id (int): model_is of the model to detect with
            data (dictionary, maps string to list of floats): timeseries data to detect anomalies in

        Returns:
            report with all anomalies
        """
        anomalies = self._detectors[id].detect(data)
        report = {}

        # init all lists of the report
        for feature in data:
            report[feature] = []


        return anomalies
    
