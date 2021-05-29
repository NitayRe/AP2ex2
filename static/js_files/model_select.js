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

    getPendingModelsIds(){
        let modelsIds = [];
        let pendings = this.__modelSelect.querySelector('.custom-options').querySelectorAll(`[data-status="pending"]`);

        pendings.forEach(pending => modelsIds.push(pending.getAttribute("data-value")));

        return modelsIds;
    }

    updateModel(model) {
        let option = this.__modelSelect.querySelector('.custom-options').querySelector(`[data-value="${model.model_id}"]`);
        option.setAttribute("data-status", model.status);
        option.innerText = "Model Id: " + model.model_id +
            "\nUpload Time: " + model.upload_time +
            "\nStatus: " + model.status;

        let status = this.__modelSelect.querySelector('.custom-select__trigger span').getAttribute("data-value");
        if(status == model.model_id){
            this.__modelSelect.querySelector('.custom-select__trigger span').setAttribute("data-status", model.status);
        }
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


//////////////////////////////////////////////
modelSelect.addNewModel(JSON.parse('{"model_id":0, "upload_time":"2021-04-22T19:15:32+02.00", "status":"ready"}'));
modelSelect.addNewModel(JSON.parse('{"model_id":1, "upload_time":"2021-04-22T19:15:32+02.00", "status":"ready"}'));
modelSelect.addNewModel(JSON.parse('{"model_id":2, "upload_time":"2021-04-22T19:15:32+02.00", "status":"ready"}'));
modelSelect.addNewModel(JSON.parse('{"model_id":3, "upload_time":"2022-04-22T20:15:32+02.00", "status":"pending"}'));
modelSelect.addNewModel(JSON.parse('{"model_id":4, "upload_time":"2023-04-22T19:15:32+03.00", "status":"pending"}'));
modelSelect.addNewModel(JSON.parse('{"model_id":5, "upload_time":"2024-04-22T19:15:32+06.00", "status":"pending"}'));