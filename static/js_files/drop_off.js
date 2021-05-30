/**
 * This is the drag area class
 */
class DragArea{
    /**
     * This is the constructor.
     * @param dropArea the drop area id.
     * @param statusStr the status label id.
     */
     constructor(dropArea, statusStr) {
         //sets field
         this.__dropArea = document.getElementById(dropArea);
         this.__statusStr = document.getElementById(statusStr);
         this.__notifyFunc = []; //observers to notify when a file was loaded.

         // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
          this.__dropArea.addEventListener(eventName, this.__preventDefaults.bind(this), false);
        });

        // Highlight drop area when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
          this.__dropArea.addEventListener(eventName, this.__highlight.bind(this), false);
        });

        // Unhighlight drop area when item is dragged out of it
        ['dragleave', 'drop'].forEach(eventName => {
          this.__dropArea.addEventListener(eventName, this.__unhighlight.bind(this), false);
        });

        // Handle dropped files
         this.__dropArea.addEventListener('drop', this.__handleDrop.bind(this), false);
     }

    /**
     * Adds an observer func.
     * @param func the func to add.
     */
    addObserverFunc(func) {
         this.__notifyFunc.push(func);
     }

    /**
     * Notifies all funcs that file was
     * loaded and sends the it's json.
     * @param dataJson the data of the file.
     * @private
     */
     __notifyAll(dataJson) {
         this.__notifyFunc.forEach(function (func){
             func(dataJson);
         });
     }

    /**
     * Prevents difault behaviors on events.
     * @param e the event.
     * @private
     */
    __preventDefaults (e) {
          e.preventDefault();
          e.stopPropagation();
    }

    /**
     * Highlight the area.
     * @param e the event.
     * @private
     */
    __highlight(e) {
          this.__dropArea.classList.add('highlight');
    }

    /**
     * Un Highlight the area.
     * @param e the event.
     * @private
     */
    __unhighlight(e) {
          this.__dropArea.classList.remove('highlight');
    }

    /**
     * Handels a drop.
     * @param e the event.
     * @private
     */
    __handleDrop(e) {
          let dt = e.dataTransfer;
          let files = dt.files;

          this.handleFiles(files);
    }

    /**
     * Handels the files it got.
     * @param files array of files.
     */
    handleFiles(files) {
         [...files].forEach(this.__readAndHandleFile, this);
    }

    /**
     * Handle a specific file.
     * @param file the file to handle.
     * @private
     */
    __readAndHandleFile(file) {
        this.__statusStr.innerHTML = "";

        if(!file.name.endsWith(".csv")){
            this.__statusStr.style.color = "red";
            this.__statusStr.innerHTML = "Error: A non .csv file isn't valid ❌";
            return;
        }

        let reader = new FileReader();

        reader.readAsText(file);

        //when file was loaded successfully.
        reader.onload = function () {
            //gets the deta in json
            let data = this.__csvDataToJson(reader.result);
            if (data == null) {
                this.__statusStr.style.color = "red";
                this.__statusStr.innerHTML = "Error: the data (lines 2+) in the .csv file should not contain strings ❌";
                return;
            }

            this.__statusStr.style.color = "green";
            this.__statusStr.innerHTML = "file was loaded successfully ✔";

            //notify all func and sends the json data.
            this.__notifyAll(data);
        }.bind(this);

        reader.onerror = function() {
            this.__statusStr.style.color = "red";
            this.__statusStr.innerHTML = "Error: " + reader.error + " ❌";
        };
    }

    /**
     * Creates Json from the data.
     * @param data the file data (from csv file).
     * @returns json of the file data.
     * @private
     */
    __csvDataToJson(data){
         let lines = data.split(/\r\n|\n|\r/);

         let headers=lines[0].split(",");

         let obj = {};
         for(let j=0;j<headers.length;++j){
             obj[headers[j]] = [];
         }

         for(let i=1;i<lines.length;++i){
             if(lines[i].length == 0){//if empty line continues
                 continue;
             }

             let currentLine=lines[i].split(",");

             for(let j=0;j<headers.length;++j){
                 let element = parseFloat(currentLine[j]);
                 if(isNaN(element)) { //the data is not a number
                     return null;
                 }
                 obj[headers[j]].push(element);
             }
         }

         return obj;
    }
}

//The drag area learn file
let dragAreaLearnFile = new DragArea("drop-area-learnFile", "statusStr-learnFile");

//The drag area resualt file
let dragAreaResultFile = new DragArea("drop-area-resultFile", "statusStr-resultFile");