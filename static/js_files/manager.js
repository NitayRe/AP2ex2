function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class Manager{
    constructor(anomalyGraph, anomalyTable, anomalyCheckbox,
                dragAreaLearnFile, dragAreaResultFile, modelSelect, clientController) {
        this.__anomalyGraph = anomalyGraph;
        this.__anomalyTable = anomalyTable;
        this.__anomalyCheckbox = anomalyCheckbox;
        this.__dragAreaLearnFile = dragAreaLearnFile;
        this.__dragAreaResultFile = dragAreaResultFile;
        this.__modelSelect = modelSelect;
        this.__clientController = clientController;
        this.__resultData = null;
        this.__learnData = null;

        this.__updateModels();
        this.__initializeSelectsEnv();
        this.__initializeNotifyFuncs();
    }

    async __updateModels() {
        while (true) {
            this.__clientController.getAllModels();

            await sleep(5000);
        }
    }

    __initializeSelectsEnv(){
        for (const dropdown of document.querySelectorAll(".custom-select-wrapper")) {
            dropdown.addEventListener('click', function () {
                this.querySelector('.custom-select').classList.toggle('open');
            })
        }

        window.addEventListener('click', function (e) {
            for (const select of document.querySelectorAll('.custom-select')) {
                if (!select.contains(e.target)) {
                    select.classList.remove('open');
                }
            }
        });
    }
    __initializeNotifyFuncs(){
        this.__initializeDragAreaFuncs();
        this.__initializeClientControllerFuncs();
    }
    __initializeClientControllerFuncs() {
        this.__clientController.addObserverFunc(function (event, response) {
            if(event != EVENTS.TrainModel) {
                return;
            }

            this.__modelSelect.addNewModel(response);
        }.bind(this));

        this.__clientController.addObserverFunc(function (event, response) {
            if(event != EVENTS.GetAnomaly) {
                return;
            }

            this.__anomalyGraph.setAnomaly(response.anomalies);
            this.__anomalyGraph.displayGraph(this.__anomalyCheckbox.getSelectedOptions());

            this.__anomalyTable.setNewTable(response.anomalies, response.reason);
        }.bind(this));

        this.__clientController.addObserverFunc(function (event, response) {
            if(event != EVENTS.GetModels) {
                return;
            }

            this.__modelSelect.updateModels(response);
        }.bind(this));
    }

    __initializeDragAreaFuncs(){
        this.__dragAreaResultFile.addObserverFunc(function (dataJson) {
            this.__anomalyCheckbox.setOptions(Object.keys(dataJson));
            this.__anomalyGraph.setData(dataJson);
            this.__resultData = dataJson;
        }.bind(this));

        this.__dragAreaLearnFile.addObserverFunc(function (dataJson) {
            this.__learnData = dataJson;
        }.bind(this));
    }

    clickTrainModel(){
        if(this.__learnData == null){
            alert("You Need To Upload A Data To Train First!!!");
            return;
        }

        let type = document.getElementById("alg-type").value;
        this.__clientController.trainModel(type, this.__learnData);
    }

    clickDelete(){
        let idSelected = this.__modelSelect.getSelectedModel();
        if(idSelected == -1){
            alert("You Need To Choose Model to Delete First!!!");
            return;
        }

        this.__modelSelect.deleteSelectedModel();
        this.__clientController.deleteModelById(idSelected);
    }

    clickDisplay(){
        if(!this.__modelSelect.isSelectedModelReady()){
            alert("You Need To Choose A Ready Model First!!!");
            return;
        }

        let idSelected = this.__modelSelect.getSelectedModel();
        if(idSelected == -1){
            alert("You Need To Choose Model First!!!");
            return;
        }

        if(this.__resultData == null ) {
            alert("You Need To Upload A Result Data First!!!");
            return;
        }

        this.__clientController.getAnomaly(idSelected, this.__resultData);
    }

    clickResetZoom(){
        this.__anomalyGraph.resetZoom();
    }
}

let manager = new Manager(anomalyGraph, anomalyTable, anomalyDrop,
    dragAreaLearnFile, dragAreaResultFile, modelSelect, clientController);