from flask import Flask, render_template, request, jsonify
from werkzeug.wrappers import Request
import backend.manager

app = Flask(__name__)

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
    manager.detete_model(int(id))
    return ''


if __name__ == '__main__':
    app.run(debug=True)
