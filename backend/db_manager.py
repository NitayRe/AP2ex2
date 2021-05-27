from typing import List
import ZODB
import transaction
import BTrees._OOBTree

class DBManager:
    def __init__(self, db_path: str) -> None:
        raise NotImplemented
    
    # data is tuple of anomaly_detector, and model info.
    def add_model(self, id_key: int, data: tuple) -> None:
        raise NotImplemented

    def delete_model(self, id_key: int) -> None:
        raise NotImplemented

    # return tuple of anomaly_detector, and model info.
    def get_model(self, id_key: int) -> tuple:
        raise NotImplemented


    # returns list of models (the info json)
    def get_models_info(self) -> List:
        raise NotImplemented
