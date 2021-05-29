# Anomaly Detection Web-App

In this project, we created two things: 
- a server, implementing a RESTful api, for creating and using anomaly detectors.
- a single-page web application for detecting anomalies - which uses the RESTful api.

[A demonstration of the project](link_to_youtube_video)

Our web-app design is:
![web-app-view](readme-resources/web-app.png?raw=TRUE "web-app")


### The functions of the RESTful api are:
- adding a new anomaly detector - train it by given data, which uses either regression algorithm, or a hybrid algorithm.
- get the info of a specific anomaly detector.
- get the info of all saved anomaly detectors.
- detect anomalies by a saved detector.
- delete a saved detector.

[for more info of the RESTful api look here](RESTful-api.md)

### The Web-Application:
It can create a new anomaly detector, and train it by a given file from the user.
It can also detect anomalies, using an existing detector, in a file the user uploads.


## The Project Structure:
There are 3 main parts of the project:
#### the model:
it includes the `manager.py` and the `db_manager.py`.
we used ZODB (database for python objects) in order to make detectors not limited for the current run of the server.
#### the view:
...
### the controller:
that is the `app.py` file - it connects the HTTP requests to the model in the backend.



## Download and Set-Up Instruction:
the following tools are required:
- python 3
- flask framework
- ZODB - python library

(and all of those dependencies)



To run the server run the `app.py` file:
```sh
python app.py
```
or: 
```sh 
python3 app.py
```
(depending on the way python 3 is run)
