from sys import path
from typing import Dict, List
import ZODB
import transaction
import BTrees._IOBTree
import pathlib
import persistent.mapping


# const
CONTAINER_NAME = "detectors"

class DBManager:
    def __init__(self, db_path: str) -> None:
        """
        creates a new db_manager object.

        Args:
            db_path (str): the path to the db.
        """
        
        db_directory = pathlib.Path(db_path).parent
        db_directory.mkdir(parents=True, exist_ok=True) # creating the db directory if needed.

        self._transaction_manager = transaction.TransactionManager()

        self._db = ZODB.DB(db_path)
        self._connection = self._db.open(self._transaction_manager)
        self._root = self._connection.root()

        if CONTAINER_NAME not in self._root:
            self._root[CONTAINER_NAME] =  persistent.mapping.PersistentMapping() #BTrees.IOBTree.IOBTree()

        self._transaction_manager.commit()

        
    def add_model(self, id_key: int, data: tuple) -> None:
        """
        saves the data of a new anomaly detector model in the db.

        Args:
            id_key (int): the key of the new model.
            data (tuple): tuple, contating the anomaly detector, and its info ('model')

        """
        #id_key = str(id_key)
        self._root[CONTAINER_NAME][id_key] = data   # adding to the db.
        self._transaction_manager.commit()                        # commiting the change.


    def delete_model(self, id_key: int) -> None:
        """
        deletes a model from the db.
        Args:
            id_key (int): the key of the model to delete.
        """
        del self._root[CONTAINER_NAME][id_key]
        self._transaction_manager.commit()

    def get_model(self, id_key: int) -> tuple:
        """
        returns model by id (key).

        Args:
            id_key (int): the id of the model.

        Returns:
            tuple: a tuple - of anomaly detector object, and a model (its info json).
        """
        return self._root[CONTAINER_NAME][id_key]


    def get_models_info(self) -> List[Dict]:
        """
        returns the info of all the models.

        Returns:
            List: containing all the models - the json info of the saved anomaly detectors.
        """
        res = list()
        for (ad_obj, model) in self._root[CONTAINER_NAME].values():
            res.append(model)

        return res
    
    def close(self) -> None:
        """
        releasing all resources
        """

        self._connection.close()
        self._db.close()
