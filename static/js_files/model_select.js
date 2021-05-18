class ModelSelect{

    /**
     * @param model is a json with this structure:
     * { model_id: <int>, upload_time: <datetime>, status: “ready” | “pending” }
     */
    addNewModel(model){
        model = JSON.parse(model);

        let mSpan = document.createElement("span");

        let mClass = document.createAttribute("class");
        mClass.value = "custom-option";
        mSpan.setAttributeNode(mClass);

        let mDataValue = document.createAttribute("data-value");
        mDataValue.value = model.model_id;
        mSpan.setAttributeNode(mDataValue);

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
                this.closest('.custom-select').querySelector('.custom-select__trigger span').textContent = "model " + idModel + " was chosen";
                this.closest('.custom-select').querySelector('.custom-select__trigger span').setAttribute("data-value", idModel);
            }
        });

        document.getElementById("model_select").appendChild(mSpan);
    }

    getSelectedModel(){
        return document.getElementById("model_select_val").getAttribute("data-value");
    }
}


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


let modelSelect = new ModelSelect();

//////////////////////////////////////////////
modelSelect.addNewModel('{"model_id":0, "upload_time":"2021-04-22T19:15:32+02.00", "status":"ready"}');
modelSelect.addNewModel('{"model_id":1, "upload_time":"2021-04-22T19:15:32+02.00", "status":"ready"}');
modelSelect.addNewModel('{"model_id":2, "upload_time":"2021-04-22T19:15:32+02.00", "status":"ready"}');
modelSelect.addNewModel('{"model_id":3, "upload_time":"2022-04-22T20:15:32+02.00", "status":"pending"}');
modelSelect.addNewModel('{"model_id":4, "upload_time":"2023-04-22T19:15:32+03.00", "status":"pending"}');
modelSelect.addNewModel('{"model_id":5, "upload_time":"2024-04-22T19:15:32+06.00", "status":"pending"}');