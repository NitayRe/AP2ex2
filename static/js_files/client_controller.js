// this is an enum for the events.
let EVENTS = {TrainModel: 0, GetModel: 1,GetModels: 2, GetAnomaly: 3}

/**
 * the client controller class is in chare of communicate with the server and send him HTTP request.
 * it send the requests with AJAX.
 * it also has observers and after every communication with the server it notify thems with the current change.
 */
class ClientController{
    /**
     * initialize the observers list.
     */
    constructor() {
        this.__notifyFunc = [];
    }

    /**
     * add new observer funct to the observers list
     * @param func the observer func.
     */
    addObserverFunc(func) {
         this.__notifyFunc.push(func);
    }

    /**
     * notify all the observer func of the change.
     * @param event the enum of the event
     * @param response the response body from the HTML response from the server.
     * @private
     */
    __notifyAll(event, response){
        this.__notifyFunc.forEach(func => func(event, response));
    }

    /**
     * this is the train new mode request.
     * @param modelType the type of the algoritem
     * @param trainData the data to train the mode.
     */
    trainModel(modelType ,trainData){
        this.__sendMassage("POST",
            "/api/model",
            "model_type=" + modelType,
            {train_data: trainData},
            EVENTS.TrainModel);
    }

    /**
     * this is the get model request.
     * @param modelId the id of the model we requests.
     */
    getModelById(modelId){
        this.__sendMassage("GET",
            "/api/model",
            "model_id=" + modelId,
            null,
            EVENTS.GetModel);
    }

    /**
     * this is the deete modee request,
     * @param modelId the id of the model we delete.
     */
    deleteModelById(modelId){
        this.__sendMassage("DELETE",
            "/api/model",
            "model_id=" + modelId,
            null,
            null);
    }

    /**
     * this is the get al the models request.
     */
    getAllModels(){
        this.__sendMassage("GET",
            "/api/models",
            null,
            null,
            EVENTS.GetModels);
    }

    /**
     * this is the get anomaly request from the model.
     * @param modelId the model we work with
     * @param predictData the resut data from the user (data JSON format)
     */
    getAnomaly(modelId, predictData){
        this.__sendMassage("POST",
            "/api/anomaly",
            "model_id=" + modelId,
            {predict_data:  predictData},
            EVENTS.GetAnomaly);
    }

    /**
     * this func send to the server a HTTP request by AJAX
     * @param type the type of the package
     * @param path the url path for the package
     * @param queryParameters after the '?'
     * @param requestBody the body of the package
     * @param event the event that happands.
     * @private
     */
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
            }.bind(this) // the function we execute if the request succeeded.
        });
    }
}
// create the client controler.
let clientController = new ClientController();