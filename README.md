# Anomaly Detection Web-App

In this project, we created two things: 
- a server, implementing a RESTful api, for creating and using anomaly detectors.
- a single-page web application for detecting anomalies - which uses the RESTful api.

[A demonstration of the project](https://youtu.be/mI9jX1b5J1I)

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
It can also detect anomalies, using an existing detector, in a file the user uploads, and present the anomalies visually on a graph and a table.

## The Project Structure:
There are 3 main parts of the project:
#### the model:
it includes the `manager.py` which acts as a facade for all the model part, and the `db_manager.py` which responsoble for managing the database.
we used ZODB (database for python objects) in order to make detectors not limited for the current run of the server. we save pairs that maps the model_id (int) to a tuple contains the [Model data structure](RESTful-api.md#model-structure) and the Anomaly detector object.
All the anomaly detectors implement the same interface even though it is not declared in the code.
#### the controller:
that is the `app.py` file - it connects the HTTP requests to the model in the backend.
we used flask framework, in order the create the controller - each uri in the RESTful API is handled by a dedicated function, which uses the model to respond to the request.
the uri of the static resources are handled automatically, and the main page (`/`) returns the `index.html` file.

UML diagram of the backend (model + controller):
![web-app-view](readme-resources/backend.png?raw=TRUE "web-app")

#### the view:
it includes the `index.html` for the content of the web page, the `js` files for functionality and the `css` files for the design of the web page.
the `index.html` includes (refers to) the `js` files and the `css` files in order to use there methods and design.
[for more info of the view look here](View.md)




## Download and Set-Up Instruction:
the following tools are required, make sure you first install them:
- python - 3.5 and above
- flask framework
- ZODB - python library

the recommended way is to install python and pip. and then install the packages via pip:
```sh
pip install flask
pip install ZODB
```



To run the server run the `app.py` file:
```sh
python app.py
```
or: 
```sh 
python3 app.py
```
(depending on the way you run python 3)
