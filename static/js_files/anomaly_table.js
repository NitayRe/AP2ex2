class AnomalyTable{

    constructor(htmlTable) {
        this.__htmlTable = document.getElementById(htmlTable);
    }

    /**
     * Get anomaly json and returns new table
     * @param anomaly is a json of type:
     * { anomalies:{ col_name_1: [span_1], col_name_2: [span_1, span_2, ... ] ….},reason: Any} }
     */
    setNewTable(anomaly,reason){
        this.__clearTable();
        this.__setHeaders(anomaly);
        this.__setBody(anomaly,reason);
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

        let rHeadStr = document.createElement("th");
        rHeadStr.innerHTML = "reason";
        this.__htmlTable.querySelector('thead tr').appendChild(rHeadStr);
    }

    __setBody(anomaly, reason){
        Object.keys(anomaly).forEach(function(key) {
            this.__setCol(anomaly, key);
        }.bind(this));

        let rCol = document.createElement("td");
        rCol.innerHTML = reason;
        this.__htmlTable.querySelector('tbody tr').appendChild(rCol);
    }

    __setCol(anomaly, key){
        let col = document.createElement("td");
        let inCol = "";

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

        col.innerHTML = inCol;

        this.__htmlTable.querySelector('tbody tr').appendChild(col);
    }
}

let anomalyTable = new AnomalyTable("anomaly-table");
