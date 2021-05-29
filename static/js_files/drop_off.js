class DragArea{
     constructor(dropArea, statusStr, handler) {
         this.__dropArea = document.getElementById(dropArea);
         this.__statusStr = document.getElementById(statusStr);
         this.__notifyFunc = [];

         // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
          this.__dropArea.addEventListener(eventName, this.__preventDefaults.bind(this), false);
        });

        // Highlight drop area when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
          this.__dropArea.addEventListener(eventName, this.__highlight.bind(this), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
          this.__dropArea.addEventListener(eventName, this.__unhighlight.bind(this), false);
        });

        // Handle dropped files
         this.__dropArea.addEventListener('drop', this.__handleDrop.bind(this), false);
     }

     addObserverFunc(func) {
         this.__notifyFunc.push(func);
     }

     __notifyAll(dataJson) {
         this.__notifyFunc.forEach(function (func){
             func(dataJson);
         });
     }

    __preventDefaults (e) {
          e.preventDefault();
          e.stopPropagation();
    }

    __highlight(e) {
          this.__dropArea.classList.add('highlight');
    }

    __unhighlight(e) {
          this.__dropArea.classList.remove('highlight');
    }

    __handleDrop(e) {
          let dt = e.dataTransfer;
          let files = dt.files;

          this.handleFiles(files);
    }

    handleFiles(files) {
         [...files].forEach(this.__readAndHandleFile, this);
    }

    __readAndHandleFile(file) {
        this.__statusStr.innerHTML = "";

        if(!file.name.endsWith(".csv")){
            this.__statusStr.style.color = "red";
            this.__statusStr.innerHTML = "Error: A non .csv file isn't valid ❌";
            return;
        }

        let reader = new FileReader();

        reader.readAsText(file);

        reader.onload = function () {
            let data = this.__csvDataToJson(reader.result);
            if (data == null) {
                this.__statusStr.style.color = "red";
                this.__statusStr.innerHTML = "Error: the data (lines 2+) in the .csv file should not contain strings ❌";
                return;
            }
            this.__statusStr.style.color = "green";
            this.__statusStr.innerHTML = "file was loaded successfully ✔";
            this.__notifyAll(data);
        }.bind(this);

        reader.onerror = function() {
            this.__statusStr.style.color = "red";
            this.__statusStr.innerHTML = "Error: " + reader.error + " ❌";
        };
    }

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
                 if(isNaN(element)) {
                     return null;
                 }
                 obj[headers[j]].push(element);
             }
         }

         return obj;
    }
}

let dragAreaLearnFile = new DragArea("drop-area-learnFile", "statusStr-learnFile");

let dragAreaResultFile = new DragArea("drop-area-resultFile", "statusStr-resultFile");