
let EVENTS = {TrainModel: 0, GetModel: 1,GetModels: 2, GetAnomaly: 3}

class ClientController{
    constructor() {
        this.__notifyFunc = [];
    }

    addObserverFunc(func) {
         this.__notifyFunc.push(func);
    }

    __notifyAll(event, response){
        this.__notifyFunc.forEach(func => func(event, response));
    }

    trainModel(modelType ,trainData){
        this.__sendMassage("POST",
            "/api/model",
            "model_type=" + modelType,
            {train_data: trainData},
            EVENTS.TrainModel);
    }

    getModelById(modelId){
        this.__sendMassage("GET",
            "/api/model",
            "model_id=" + modelId,
            null,
            EVENTS.GetModel);
    }

    deleteModelById(modelId){
        this.__sendMassage("DELETE",
            "/api/model",
            "model_id=" + modelId,
            null,
            null);
    }

    getAllModels(){
        this.__sendMassage("GET",
            "/api/models",
            null,
            null,
            EVENTS.GetModels);
    }

    getAnomaly(modelId, predictData){
        this.__sendMassage("POST",
            "/api/anomaly",
            "model_id=" + modelId,
            {predict_data:  predictData},
            EVENTS.GetAnomaly);
    }

    __sendMassage(type, path, queryParameters, requestBody, event){
        if(queryParameters != null) {
            path += "?" + queryParameters;
        }
        if(requestBody == null) {
            requestBody = {};
        }

        jQuery.ajax({
            url: path,
            data: JSON.stringify(requestBody),
            contentType: 'application/json;charset=UTF-8',
            type: type,
            success: function(response) {
                this.__notifyAll(event, response);
            }.bind(this)
        });
    }
}

let clientController = new ClientController();