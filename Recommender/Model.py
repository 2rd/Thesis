from lightfm import LightFM


class Model:
    """
    docstring
    """

    def __init__(self, model, interactions):
        self.model = model
        self.interactions = interactions

    def get_model(self):
        return self.model

    def set_model(self, model):
        self.model = model

    def retrain(self, model, interactions):
        self.set_model(model.fit_partial(interactions))

        return model
