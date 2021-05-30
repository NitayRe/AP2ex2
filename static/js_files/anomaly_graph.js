/**
 * this class is in charge of the graph.
 * it can create new graph and update the points on the graph.
 */
class AnomalyGraph{
    /**
     * create a new graph.
     * @param name the name of the graph
     */
    constructor(name) {
        this.__data = -1;
        this.__anomaly = -1;

        this.__chart = new Chart(name, {
          type: "scatter",
          data: {
              //at first the graph is empty.
            datasets: []
          },
          options: {
                scales: {
                    xAxes: [ {
                      scaleLabel: {
                        display: true,
                        labelString: 'Index'
                      }
                    } ],
                    yAxes: [ {
                      scaleLabel: {
                        display: true,
                        labelString: 'Value'
                      }
                    }]
                  },
                elements: {
                  point: {
                    backgroundColor : this.__customColor.bind(this),
                    display: true
                  }
                },
              plugins: {
                    zoom: {
                        // Container for pan options
                        pan: {
                            // Boolean to enable panning
                            enabled: true,
                            mode: 'xy',
                            // On category scale, factor of pan velocity
                            speed: 20
                        },
                        // Container for zoom options
                        zoom: {
                            // Boolean to enable zooming
                            enabled: true,
                            // Enable drag-to-zoom behavior
                            wheel: true,
                            mode: 'xy',
                            // Speed of zoom via mouse wheel
                            // (percentage of zoom on a wheel event)
                            speed: 0.1
                        }
                    }
                }
          }
        });
    }

    /**
     * this func display al the graphs of the vars from the varnames list
     * @param varNames
     */
    displayGraph(varNames) {
        if(this.__data == -1) {
            return;
        }
        //update the datasets of the graph.
        this.__chart.data.datasets = this.__getDatasets(varNames);
        //update the chart in order to show the new dataset.
        this.__chart.update();
    }

    /**
     * this func returs the dataset for the spacific vars in the varNames list.
     *
     * @param varNames - a list of vars to show.
     * @returns {*[]} - a dataset of the choosen vars. This means the data of the points that those vars gets.
     * @private
     */
    __getDatasets(varNames){
        let datasets = [];
        // for every name we add a new set to the datasets.
        varNames.forEach(function (name) {
            let xyValues = this.__getXYValues(name);

            datasets.push({
                label: name,
                fill: false,
                radius: 5,
                borderColor: "#" + Math.floor(Math.random()*16777215).toString(16),
                borderWidth: 2,
                showLine: true,
                data: xyValues
            });
        }.bind(this));

        return datasets;
    }

    /**
     * this func returns the values of a certain var.
     * @param name the var we return its data.
     * @returns {*[]} list of dictionaries that map index to value.
     * @private
     */
    __getXYValues(name) {
        let xyValues = [];

        let index = 0;
        this.__data[name].forEach(function (value) {
            xyValues.push({x:index, y:value});
            ++index;
        });

        return xyValues;
    }

    /**
     * set the graph data.
     * @param data the new data
     */
    setData(data) {
        this.__data = data;
    }

    /**
     * set the graph anomay
     * @param anomaly the new anomaly
     */
    setAnomaly(anomaly) {
        this.__anomaly = anomaly;
    }

    /**
     * this func returns the color of the point. if the point in anomaly the color is red,
     * otherwise black,
     * @param context the x value of the point.
     * @returns {string} the color of the point
     * @private
     */
    __customColor(context) {
        // the defult color is black.
        let color = "rgba(0,0,0,1)";
        if(this.__anomaly == -1) {
            return color;
        }
        //check if the context is in any of the anomay span.
        let isFound = this.__anomaly[context.dataset.label].find(function (span) {
            return (span[0] <= context.dataIndex) && (context.dataIndex <= span[1]);
        });
        if(isFound != undefined) {
            color = "rgba(255,0,0,1)";
        }
        return color;
    }

    /**
     * reset the chart zoom.
     */
    resetZoom(){
        this.__chart.resetZoom();
    }
}
let anomalyGraph = new AnomalyGraph("anomaly-chart");
