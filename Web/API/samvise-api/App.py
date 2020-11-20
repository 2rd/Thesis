import flask
import json
from flask import request, jsonify
import recommender as rec
from flask_cors import CORS, cross_origin

app = flask.Flask(__name__)
cors = CORS(app)
app.config['DEBUG'] = True


@app.route('/hello/', methods=['GET'])
def hello():
    return 'SAMVISE'


@app.route('/get-recommendations/', methods=['GET'])
def get_recommendations():
    '''
    Takes a string in json format of interactions {movieId:"x", rating:x}
    and returns recommendations in json format.
    '''
    interactions = request.args['interactions']

    try:
        return jsonify({'results': rec.recommend(interactions)})

    except KeyError:
        return f'invalid input'
