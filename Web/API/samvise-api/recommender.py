import numpy as np
from scipy.sparse import csr_matrix
import pickle
import lightfm
import ast


user_dict = pickle.load(open('data/10M/user_dict.p', 'rb'))
item_dict = pickle.load(open('data/10M/item_dict.p', 'rb'))
vis_feats = pickle.load(open('data/10M/visual_features.p', 'rb'))
tag_feats = pickle.load(open('data/10M/tag_features.p', 'rb'))
subs_feats = pickle.load(open('data/10M/subs_features.p', 'rb'))
user_id = 69878


def new_empty_csr(old_csr):
    new_empty = np.zeros([old_csr.shape[0], old_csr.shape[1]])

    return csr_matrix(new_empty)


def new_interactions(movie_ids, old_interactions):

    movies = (list(item_dict.keys()).index(str(x)) for x in movie_ids)
    # movies = (item_dict[str(x)] for x in movie_ids)

    new_interactions = new_empty_csr(old_interactions).tolil()
    for movie in movies:
        new_interactions[user_dict[user_id], movie] = 1

    return new_interactions.tocsr()


def merge_interactions(old_interactions, new_interactions):
    merged = old_interactions
    for a in range(new_interactions.shape[0]):
        for i in new_interactions[a].indices:
            merged[a, i] = 1
    return merged


def ratings_to_likes(ratings):
    likes = []
    for key in ratings.keys():
        if ratings[key] >= 4:
            likes.append(key)

    return likes


def retrain(model, interacts, item_feats):

    return model.fit_partial(interacts, item_features=item_feats, epochs=25, num_threads=2)


def get_top_items(items, item_scores, known_positives):
    top_items = items[np.argsort(-item_scores)]
    top_items_dict = {}
    i = 0
    for item in top_items:
        if item not in known_positives and item_dict[item] != '':
            top_items_dict[i+1] = {'movieId': item, 'title': item_dict[item]}
            i += 1
        if len(top_items_dict.keys()) >= 10:
            break

    #top_items_dict = {1: {'movieId': top_items[0], 'title': item_dict[top_items[0]]}, 2: {'movieId': top_items[1], 'title': item_dict[top_items[1]]}, 3: {'movieId': top_items[2], 'title': item_dict[top_items[2]]}, 4: {'movieId': top_items[3], 'title': item_dict[top_items[3]]}, 5: {'movieId': top_items[4], 'title': item_dict[top_items[4]]}}
    return top_items_dict


def recommendations(model, interactions, item_features):

    n_items = interactions.shape[1]
    items = np.array(list(item_dict.keys()), dtype=str)

    known_positives = items[interactions.tocsr()[user_dict[user_id]].indices]

    scores = model.predict(user_dict[user_id], np.arange(
        n_items), item_features=item_features)

    top_items_dict = get_top_items(
        items, scores, known_positives)

    positives_dict = {}
    for known in range(len(known_positives)):
        positives_dict[known+1] = {'movieId': known_positives[known],
                                   'title': item_dict[known_positives[known]]}

    return {'top_items': top_items_dict, 'known_positives': positives_dict}


def recommend(new_ratings):
    '''
    Takes a json object ratings {movieId:rating}
    and generates recommendations from 3 different models
    based on the ratings.
    '''

    vis_model = pickle.load(open('data/10M/visual_model.p', 'rb'))
    tag_model = pickle.load(open('data/10M/tag_model.p', 'rb'))
    subs_model = pickle.load(open('data/10M/subs_model.p', 'rb'))

    old_interactions = pickle.load(open('data/10M/interactions.p', 'rb'))
    new_ratings = ratings_to_likes(ast.literal_eval(new_ratings))
    new_interacts = new_interactions(new_ratings, old_interactions)

    new_vis_model = retrain(vis_model, new_interacts, vis_feats)
    new_tag_model = retrain(tag_model, new_interacts, tag_feats)
    new_subs_model = retrain(subs_model, new_interacts, subs_feats)

    merged_interactions = merge_interactions(old_interactions, new_interacts)

    vis_recs = recommendations(new_vis_model, merged_interactions, vis_feats)
    tag_recs = recommendations(new_tag_model, merged_interactions, tag_feats)
    subs_recs = recommendations(
        new_subs_model, merged_interactions, subs_feats)

    return {'visual': vis_recs, 'tags': tag_recs, 'subtitles': subs_recs}
