class AnomalyGraph{

    constructor(name) {
        this.__data = -1;
        this.__anomaly = -1;

        this.__chart = new Chart(name, {
          type: "scatter",
          data: {
            datasets: []
          },
          options: {
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

    displayGraph(varNames) {
        if(this.__data == -1) {
            return;
        }

        this.__chart.data.datasets = this.__getDatasets(varNames);

        this.__chart.update();
    }

    __getDatasets(varNames){
        let datasets = [];
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
    __getXYValues(name) {
        let xyValues = [];

        let index = 0;
        this.__data[name].forEach(function (value) {
            xyValues.push({x:index, y:value});
            ++index;
        });

        return xyValues;
    }

    setData(data) {
        this.__data = data;
    }

    setAnomaly(anomaly) {
        this.__anomaly = anomaly;
    }

    __customColor(context) {
        let color = "rgba(0,0,0,1)";
        if(this.__anomaly == -1) {
            return color;
        }

        let isFound = this.__anomaly[context.dataset.label].find(function (span) {
            return (span[0] <= context.dataIndex) && (context.dataIndex <= span[1]);
        });
        if(isFound != undefined) {
            color = "rgba(255,0,0,1)";
        }
        return color;
    }

    resetZoom(){
        this.__chart.resetZoom();
    }
}
let anomalyGraph = new AnomalyGraph("anomaly-chart");
