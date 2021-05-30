# The view side


![view-uml](readme-resources/frontend.png?raw=TRUE "view-uml")

## the view side classes:
 
**Manager:** the manger is the controller of the view. It sends requests to the other classes and control them.
It implements the connection between the classes and in charge of the buttons functionality.

**Anomaly Graph:** the anomaly graph presents the graph of the selected variables from the `checkbox`. It also shows the anomaly points in red.
you can also drag and zoom in order to examine spacific parts of the graphs.

**CheckBox:** in the check box the user select the spacific variables to show in the `anomaly graph`.

**ModelSelect:** the model select presents all the corrent models on the server and their information. In the model select the user can choose a model
to analize the result file by. The model select refreshes every 5 seconds and updates the models list, This fuctioality is implemented by the `manager`.

**ClientController:** the client controller is in charge of the commionication with the server. The communication is done by `AJAX`.
