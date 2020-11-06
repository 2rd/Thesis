from lightfm import LightFM


class Recommender:

    def __init__(self, item_dict={}, user_dict={}, item_features=[], interactions=[], user_id=None):
        self.recommendations = {}
        self.item_dict = item_dict
        self.user_dict = user_dict
        self.interactions = interactions
        self.user_id = user_id

    def get_interactions(self):

        return self.interactions

    def get_user_dict(self):

        return self.user_dict

    def explain(self, recommendations, interactions, items):
        '''
        Give explanations based on the features of
        the recommended items and the user's interactions
        '''
        known_positives = self.known_positives()
        explanations = {}

        return explanations

    def known_positives(self):
        user_index = self.get_user_dict()[self.user_id]
        known_positives = selfitems[self.interactionsinteractions[user_index].indices]

        return known_positives

    def recommend(self, user_id, users, model, items):

        recommendations = {}

        return recommendations
