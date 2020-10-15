from lightfm import LightFM


class Recommender:

    def __init__(self, item_dict, user_dict, item_features, interactions):
        self.recommendations = {}
        self.item_dict = item_dict
        self.user_dict = user_dict

    def explain(self, recommendations, interactions, items):
        '''
        Give explanations based on the features of
        the recommended items, and the user's interactions
        '''
        explanations = {}

        return explanations

    def known_positives(self, interactions, items, user_id, user_dict):
        user_index = user_dict[user_id]
        known_positives = items[interactions[user_index].indices]

        return known_positives

    def recommend(self, user_id, users, model, items):

        recommendations = {}

        return recommendations
