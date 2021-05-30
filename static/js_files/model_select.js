class ModelSelect{

    constructor(modelSelect) {
        this.__modelSelect = document.getElementById(modelSelect);
    }
    /**
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

    __getPendingModelsIds(){
        let modelsIds = [];
        let pendings = this.__modelSelect.querySelector('.custom-options').querySelectorAll(`[data-status="pending"]`);

        pendings.forEach(pending => modelsIds.push(parseInt(pending.getAttribute("data-value"))));

        return modelsIds;
    }

    updateModels(models) {
        let penndingsIds = this.__getPendingModelsIds();
        models.forEach(function (model){
            let option = this.__modelSelect.querySelector('.custom-options').querySelector(`[data-value="${model.model_id}"]`);

            if(option == null) {
                this.addNewModel(model);
                return;
            }

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

    deleteSelectedModel(){
        let deleteId = parseInt(this.getSelectedModel());
        if(deleteId == -1) {
            return;
        }

        this.__modelSelect.querySelector('.custom-select__trigger span').setAttribute("data-value", "-1");
        this.__modelSelect.querySelector('.custom-select__trigger span').setAttribute("data-status", "-1");
        this.__modelSelect.querySelector('.custom-select__trigger span').textContent = "";

        let deletedModel = this.__modelSelect.querySelector('.custom-options').querySelector(`[data-value="${deleteId}"]`);
        deletedModel.parentNode.removeChild(deletedModel);
    }

    getSelectedModel(){
        return this.__modelSelect.querySelector('.custom-select__trigger span').getAttribute("data-value");
    }
    isSelectedModelReady(){
        let status = this.__modelSelect.querySelector('.custom-select__trigger span').getAttribute("data-status");
        return (status.localeCompare("ready") == 0);
    }
}

let modelSelect = new ModelSelect("model-select");
