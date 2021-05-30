/**
 * this class is in charge of the models list.
 */
class ModelSelect{
    /**
     *
     * @param modelSelect the id of the model select
     */
    constructor(modelSelect) {
        this.__modelSelect = document.getElementById(modelSelect);
    }
    /**
     * add a new model to the list
     * @param model is a json with this structure:
     * { model_id: <int>, upload_time: <datetime>, status: “ready” | “pending” }
     */
    addNewModel(model){
        let mSpan = document.createElement("span");

        let mClass = document.createAttribute("class");
        mClass.value = "custom-option";
        mSpan.setAttributeNode(mClass);

        let mDataValue = document.createAttribute("data-value");
        mDataValue.value = model.model_id;
        mSpan.setAttributeNode(mDataValue);

        let mDataStatus = document.createAttribute("data-status");
        mDataStatus.value = model.status;
        mSpan.setAttributeNode(mDataStatus);

        mSpan.innerText = "Model Id: " + model.model_id +
            "\nUpload Time: " + model.upload_time +
            "\nStatus: " + model.status;
        //add new listenet to the mspan
        mSpan.addEventListener('click', function () {
            if (!this.classList.contains('selected')) {
                let prevSelected = this.parentNode.querySelector('.custom-option.selected');
                if(prevSelected != null) {
                    prevSelected.classList.remove('selected');
                }

                this.classList.add('selected');
                let idModel = this.getAttribute("data-value");
                let statusModel = this.getAttribute("data-status");
                this.closest('.custom-select').querySelector('.custom-select__trigger span').textContent = "model " + idModel + " was chosen";
                this.closest('.custom-select').querySelector('.custom-select__trigger span').setAttribute("data-value", idModel);
                this.closest('.custom-select').querySelector('.custom-select__trigger span').setAttribute("data-status", statusModel);
            }
        });

        this.__modelSelect.querySelector('.custom-options').appendChild(mSpan);
    }

    /**
     * retuns a list of all the panding models id's.
     * @returns {*[]}  the list of the pending modelst IDs.
     * @private
     */
    __getPendingModelsIds(){
        let modelsIds = [];
        let pendings = this.__modelSelect.querySelector('.custom-options').querySelectorAll(`[data-status="pending"]`);

        pendings.forEach(pending => modelsIds.push(parseInt(pending.getAttribute("data-value"))));

        return modelsIds;
    }

    /**
     * update the models by the models list.
     * @param models
     */
    updateModels(models) {
        let penndingsIds = this.__getPendingModelsIds();
        // we add wech new model to the modelselect. it a model is pending we ceck if it change the status
        models.forEach(function (model){
            let option = this.__modelSelect.querySelector('.custom-options').querySelector(`[data-value="${model.model_id}"]`);
            // if the model wasn't in the modelselect before.
            if(option == null) {
                this.addNewModel(model);
                return;
            }
            // if the model is already exist and is ready.
            if(!penndingsIds.includes(model.model_id)){
                return;
            }

            //if we are here the model is already in the select and is pending
            option.setAttribute("data-status", model.status);
            option.innerText = "Model Id: " + model.model_id +
                "\nUpload Time: " + model.upload_time +
                "\nStatus: " + model.status;

            let status = this.__modelSelect.querySelector('.custom-select__trigger span').getAttribute("data-value");
            if(status == model.model_id){
                this.__modelSelect.querySelector('.custom-select__trigger span').setAttribute("data-status", model.status);
            }
        }.bind(this));
    }

    /**
     * delete the selected model
     */
    deleteSelectedModel(){
        // get the id of the selected model.
        let deleteId = parseInt(this.getSelectedModel());
        // if it was alreay deleted.
        if(deleteId == -1) {
            return;
        }

        this.__modelSelect.querySelector('.custom-select__trigger span').setAttribute("data-value", "-1");
        this.__modelSelect.querySelector('.custom-select__trigger span').setAttribute("data-status", "-1");
        this.__modelSelect.querySelector('.custom-select__trigger span').textContent = "";

        let deletedModel = this.__modelSelect.querySelector('.custom-options').querySelector(`[data-value="${deleteId}"]`);
        deletedModel.parentNode.removeChild(deletedModel);
    }

    /**#
     * return the id of the selected model.
     * @returns {string} the selected model id.
     */
    getSelectedModel(){
        return this.__modelSelect.querySelector('.custom-select__trigger span').getAttribute("data-value");
    }

    /**
     * check if the selected model is ready.
     * @returns {boolean}
     */
    isSelectedModelReady(){
        let status = this.__modelSelect.querySelector('.custom-select__trigger span').getAttribute("data-status");
        return (status.localeCompare("ready") == 0);
    }
}
// create the model select.
let modelSelect = new ModelSelect("model-select");
