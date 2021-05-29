from flask import Flask, render_template, request, jsonify
from werkzeug.wrappers import Request
import atexit
import backend.manager
import json

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
    algo_type = request.args.get("model_type", '')
    data = request.get_json()["train_data"]
    model = manager.add_model(algo_type, data)
    return model

@app.route('/api/model', methods = ['GET'])
def get_model():
    id = request.args.get("model_id", '')
    return manager.get_model(int(id))

@app.route('/api/models', methods = ['GET'])
def get_all_models():
    return jsonify(manager.get_all_models())

@app.route('/api/model', methods = ['DELETE'])
def delete_model():
    id = request.args.get("model_id", '')
    manager.delete_model(int(id))
    return ''

@app.route('/api/anomaly', methods = ['POST'])
def anomalies():
    id = int(request.args.get("model_id", ''))
    data = request.get_json()["predict_data"]
    return manager.detect_anomalies(id, data)


def release_resources():
    if manager != None:
        manager.close()

atexit.register(release_resources)

if __name__ == '__main__':
    app.run(debug=True)
