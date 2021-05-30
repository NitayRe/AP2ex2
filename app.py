from flask import Flask, render_template, request, jsonify, redirect, url_for
from werkzeug.wrappers import Request
import atexit
import backend.manager

manager = None

app = Flask(__name__)


@app.before_first_request
def init_manager():
    global manager
    manager = backend.manager.ModelsManager()

@app.route('/')
def start():
    return render_template('index.html')

@app.route('/api/model', methods = ['POST'])
def train_model():
    try:
        algo_type = request.args.get("model_type", '')
        data = request.get_json()["train_data"]
        model = manager.add_model(algo_type, data)
        return model
    except Exception as e:
        return str(e), 400 # status code 400 Bad Request


@app.route('/api/model', methods = ['GET'])
def get_model():
    try:
        id = request.args.get("model_id", '')
        return manager.get_model(int(id))
    except Exception as e:
        return str(e), 400 # status code 400 Bad Request
    

@app.route('/api/models', methods = ['GET'])
def get_all_models():
    try:
        return jsonify(manager.get_all_models())
    except Exception as e:
        return str(e), 400 # status code 400 Bad Request


@app.route('/api/model', methods = ['DELETE'])
def delete_model():
    try:
        id = request.args.get("model_id", '')
        manager.delete_model(int(id))
        return ''
    except Exception as e:
        return str(e), 400 # status code 400 Bad Request
    

@app.route('/api/anomaly', methods = ['POST'])
def anomalies():
    try:
        model_id = int(request.args.get("model_id", ''))
        data = request.get_json()["predict_data"]
        
        if data == None:
            return redirect(url_for(f"train_model", model_id=model_id), code=302)

        return manager.detect_anomalies(model_id, data)
    except Exception as e:
        return str(e), 400 # status code 400 Bad Request
    

def release_resources():
    if manager != None:
        manager.close()

atexit.register(release_resources)

if __name__ == '__main__':
    app.run(port=9876)
