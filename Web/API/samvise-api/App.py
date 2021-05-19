import flask
import json
from flask import request, jsonify, Response
from flask.ctx import copy_current_request_context
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

    # @copy_current_request_context
    # def generate_recs():
    #     interactions = request.args['interactions']
    #     # yield {}
    #     yield jsonify({'results': rec.recommend(interactions)})

    # return Response(generate_recs(), mimetype='application/json')
