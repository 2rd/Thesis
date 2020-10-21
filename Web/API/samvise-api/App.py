import flask
from flask import request
import pickle


rec_models = pickle.load(open('1Mevaluation.p', 'rb'))

app = flask.Flask(__name__)


@app.route('/', methods=['GET'])
def home():
    eval = request.args['method']
    try:
        return rec_models[eval]
    except KeyError:
        return 'Invalid input'
