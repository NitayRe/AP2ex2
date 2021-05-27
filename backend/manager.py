from anomaly_detection.regression_detector import RegressionAnomalyDetector
from anomaly_detection.hybrid_detector import HybridAnomalyDetector

# maps algorithm name to its detector class
ALGORITHMS = {"regression": RegressionAnomalyDetector, "hybrid": HybridAnomalyDetector}


class ModelsManager:
    """a class for handling all saved models"""

    def __init__(self):
        self._models = {} # maps id is to its model
        self._detectors = {} # maps id is to its model
        self._current_max_id = 0

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
        
        return self._models[self._current_max_id]

    def get_model(self, id):
        """return a model by its id"""
        return self._models[id]

    def get_all_models(self):
        """
        Returns:
            list of Models: list of all models
        """
        return list(self._models.values())

    def detete_model(self, id):
        """delete a model by its id"""
        self._models.pop(id)
        self._detectors.pop(id)


