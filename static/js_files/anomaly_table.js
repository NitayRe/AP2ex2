/**
 * This class is in chrage of the anomaly table.
 * it showes the anomalys of the vars from the anomaly and the reason for the anomaly.
 */
class AnomalyTable{
    /**
     * the constructor of the anomaly table
     * @param htmlTable the id of the table that we show the data.
     */
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

    /**
     * cleare the table.
     * @private
     */
    __clearTable(){
        this.__htmlTable.querySelector('thead tr').innerHTML = '';
        this.__htmlTable.querySelector('tbody tr').innerHTML = '';
    }

    /**
     * set the headers of the table by the var names from the anomaly
     * @param anomaly the anomaly JSON
     * @private
     */
    __setHeaders(anomaly) {
        Object.keys(anomaly).forEach(function(key) {
            let headStr = document.createElement("th");
            headStr.innerHTML = key;

            this.__htmlTable.querySelector('thead tr').appendChild(headStr);
        }.bind(this));

        let rHeadStr = document.createElement("th");
        // add the title for the reason.
        rHeadStr.innerHTML = "reason";
        this.__htmlTable.querySelector('thead tr').appendChild(rHeadStr);
    }

    /**
     * set the body of the table by the anomaly and the reason.
     * @param anomaly the anomaly JSON
     * @param reason the reason for the anomalies.
     * @private
     */
    __setBody(anomaly, reason){
        Object.keys(anomaly).forEach(function(key) {
            this.__setCol(anomaly, key);
        }.bind(this));

        let rCol = document.createElement("td");
        rCol.innerHTML = reason;
        this.__htmlTable.querySelector('tbody tr').appendChild(rCol);
    }

    /**
     * set a col in the table for the spacific key.
     * @param anomaly the anomaly JSON
     * @param key the title of the column that we add the value there.
     * @private
     */
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
// create the anomaly table.
let anomalyTable = new AnomalyTable("anomaly-table");
