/**
 * This is a sleep func
 * @param ms time in ms to sleep.
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * This is the manager class.
 */
class Manager{
    /**
     * This is the constructor of the manager class.
     * @param anomalyGraph represents the anomaly graph.
     * @param anomalyTable represents the anomaly table.
     * @param anomalyCheckbox represents the checkbox to choose var to display from.
     * @param dragAreaLearnFile an area to upload files to learn from.
     * @param dragAreaResultFile an area to upload files to analize anomaly from.
     * @param modelSelect the model to analize by the anomalies.
     * @param clientController in charge of the communication with the server.
     */
    constructor(anomalyGraph, anomalyTable, anomalyCheckbox,
                dragAreaLearnFile, dragAreaResultFile, modelSelect, clientController) {
        //sets the fields of this class.
        this.__anomalyGraph = anomalyGraph;
        this.__anomalyTable = anomalyTable;
        this.__anomalyCheckbox = anomalyCheckbox;
        this.__dragAreaLearnFile = dragAreaLearnFile;
        this.__dragAreaResultFile = dragAreaResultFile;
        this.__modelSelect = modelSelect;
        this.__clientController = clientController;
        this.__resultData = null;
        this.__learnData = null;

        //starts the logic to updates the models.
        this.__updateModels();

        //intialize things for the select element
        this.__initializeSelectsEnv();

        //intialize basic observers.
        this.__initializeNotifyFuncs();
    }

    /**
     * This func is async and updates the model every 5 second.
     * @private
     */
    async __updateModels() {
        while (true) {
            this.__clientController.getAllModels();

            await sleep(5000);
        }
    }

    /**
     * Initialize select first things.
     * @private
     */
    __initializeSelectsEnv(){
        // adds the open funcuality when drop is pressed
        for (const dropdown of document.querySelectorAll(".custom-select-wrapper")) {
            dropdown.addEventListener('click', function () {
                this.querySelector('.custom-select').classList.toggle('open');
            })
        }

        // if you would click the window the drop will close.
        window.addEventListener('click', function (e) {
            for (const select of document.querySelectorAll('.custom-select')) {
                if (!select.contains(e.target)) {
                    select.classList.remove('open');
                }
            }
        });
    }

    /**
     * Intialize basic observers.
     * @private
     */
    __initializeNotifyFuncs(){
        this.__initializeDragAreaFuncs();
        this.__initializeClientControllerFuncs();
    }

    /**
     * Initialize the observers func to handle servers response.
     * @private
     */
    __initializeClientControllerFuncs() {

        //handles train model response
        this.__clientController.addObserverFunc(function (event, response) {
            if(event != EVENTS.TrainModel) {
                return;
            }

            //adding the knew model
            this.__modelSelect.addNewModel(response);
        }.bind(this));

        //handels get anomaly response
        this.__clientController.addObserverFunc(function (event, response) {
            if(event != EVENTS.GetAnomaly) {
                return;
            }

            //sets the graph and display it
            this.__anomalyGraph.setAnomaly(response.anomalies);
            this.__anomalyGraph.displayGraph(this.__anomalyCheckbox.getSelectedOptions());

            //sets the table
            this.__anomalyTable.setNewTable(response.anomalies, response.reason);
        }.bind(this));

        //handels the get models response
        this.__clientController.addObserverFunc(function (event, response) {
            if(event != EVENTS.GetModels) {
                return;
            }

            //updates all models
            this.__modelSelect.updateModels(response);
        }.bind(this));
    }

    /**
     * Intialize the drag observers
     * @private
     */
    __initializeDragAreaFuncs(){
        //handle drop for reasult file
        this.__dragAreaResultFile.addObserverFunc(function (dataJson) {
            this.__anomalyCheckbox.setOptions(Object.keys(dataJson));
            this.__anomalyGraph.setData(dataJson);
            this.__resultData = dataJson;
        }.bind(this));

        //handle drop for learn file
        this.__dragAreaLearnFile.addObserverFunc(function (dataJson) {
            this.__learnData = dataJson;
        }.bind(this));
    }

    /**
     * Handels click train model button.
     */
    clickTrainModel(){
        if(this.__learnData == null){
            alert("You Need To Upload A Data To Train First!!!");
            return;
        }

        //trains the model
        let type = document.getElementById("alg-type").value;
        this.__clientController.trainModel(type, this.__learnData);
    }

    /**
     * Handels click delete button
     */
    clickDelete(){
        let idSelected = this.__modelSelect.getSelectedModel();
        if(idSelected == -1){
            alert("You Need To Choose Model to Delete First!!!");
            return;
        }

        //delete the selected model
        this.__modelSelect.deleteSelectedModel();
        this.__clientController.deleteModelById(idSelected);
    }

    /**
     * Handels click display button
     */
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

        //gets the anomaly from server (the response would display the resualt)
        this.__clientController.getAnomaly(idSelected, this.__resultData);
    }

    /**
     * Handels click reset zoom button
     */
    clickResetZoom(){
        this.__anomalyGraph.resetZoom();
    }
}

//creating the manager
let manager = new Manager(anomalyGraph, anomalyTable, anomalyDrop,
    dragAreaLearnFile, dragAreaResultFile, modelSelect, clientController);