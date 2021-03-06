## The RESTful API:

as said in the readme.md, the RESTful API has 5 function:
- creating new detector
- get info of a detector
- get info of all the detectros
- detect anomalies using specific detector
- delete a detector.

#### Creating new anomaly detector
POST: `/api/model` with query arguments of `model_type` which can by either `regression` or `hybrid`.
the body of the HTTP request will contain the data on which the model needs to practice at the form: `{"train_data":<Data>}`.
the model will be train Asynchronously, although the resonse with model_id will be returned immediately (with "pending" status).

the body of the response will be a json of the information of the detector - see [Model Structure](#model-structure)


#### Receive information of a detector
GET: `/api/model` with query arguments of `model_id`.

the response will contain the Model Data Structure of the detector, or, if not exists, suitable error code.

#### Receive information of all detectors
GET: `/api/models`.

the response wil contain a list of all the Models, of the detectors.

#### Detect anomalies
POST: `/api/anomaly` with query arguments of `model_id` - the model to use to detect anomalies.
the body of the request needs to contain the data, from which anomalies needs to be detected at the form: `{"predict_data":<Data>}`

the body of the response will be a json of the anomalies detected - see [Anomaly Structure](#anomaly-structure).

#### Delete model
DELETE: `api/model` with query arguments of `model_id` - the model to delete.
note: this method (like the others) is non-secure - anyone can access the list of models, and delete them.



## Relevent Data Structures

### Model Structure
data structure: `{model_id: <int>, upload_time: <time>, status: "ready" | "pending"}` - "pending" means the model has not done practicing over the valid data, so it can not be used yet to detect anomalies. "ready" means it's done, and can be used to detect anomalies on others sets of data.

### Data Structure
data structure: represent a timeseries `{column1: [value1, value2...], column2:[value1, value2...] }`.

### Anomaly Structure
data structure:  `{ anomalies:{ col_name_1: [span_1], col_name_2: [span_1,span_2, ... ] ....},reason: corellated features} }`.
each span is a couple '[span_start, span_end]' with the bounderies of the span. the reason field contain information about the correlative features used to detect the anomalies.