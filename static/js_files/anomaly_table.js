class AnomalyTable{

    constructor(htmlTable) {
        this.__htmlTable = document.getElementById(htmlTable);
    }

    /**
     * Get anomaly json and returns new table
     * @param anomaly is a json of type:
     * { anomalies:{ col_name_1: [span_1], col_name_2: [span_1, span_2, ... ] ….},reason: Any} }
     */
    setNewTable(anomaly){
        this.__clearTable();
        this.__setHeaders(anomaly);
        this.__setBody(anomaly);
    }

    __clearTable(){
        this.__htmlTable.querySelector('thead tr').innerHTML = '';
        this.__htmlTable.querySelector('tbody tr').innerHTML = '';
    }


    __setHeaders(anomaly) {
        Object.keys(anomaly).forEach(function(key) {
            let headStr = document.createElement("th");
            headStr.innerHTML = key;

            this.__htmlTable.querySelector('thead tr').appendChild(headStr);
        }.bind(this));
    }

    __setBody(anomaly){
        Object.keys(anomaly).forEach(function(key) {
            this.__setCol(anomaly, key);
        }.bind(this));
    }

    __setCol(anomaly, key){
        let col = document.createElement("td");
        let inCol = "";

        if(key === "reason") {
            inCol = anomaly[key];
        } else {
            anomaly[key].forEach(function (span) {

                if (inCol !== "") {
                    inCol += "<br>";
                }

                if (span[0] == span[1]) {
                    inCol += span[0].toString();
                } else {
                    inCol += span[0].toString() + " - " + span[1].toString();
                }
            });
        }
        col.innerHTML = inCol;

        this.__htmlTable.querySelector('tbody tr').appendChild(col);
    }
}

let anomalyTable = new AnomalyTable("anomaly-table");
//anomalyTable.setNewTable(JSON.parse('{"a":[[0,0], [2,5], [9,111111111111111111111111111111111111111116]], "b":[[5,6], [8,10], [20,86], [89,89], [140,150], [150,150]], "b1":[[5,6], [8,10], [20,86], [89,89], [140,150], [150,150]], "b2":[[5,6], [8,10], [20,86], [89,89], [140,150], [150,150]], "b3":[[5,6], [8,10], [20,86], [89,89], [140,150], [150,150]], "b4":[[5,6], [8,10], [20,86], [89,89], [140,150], [150,150]], "b5":[[5,6], [8,10], [20,86], [89,89], [140,150], [150,150]], "b64444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444":[[5,6], [8,10], [20,86], [89,89], [140,150], [150,150]], "c":[[0,0], [50,98], [112,116]], "reason":"bad"}'));