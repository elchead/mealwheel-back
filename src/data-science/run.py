import json
import sys
import os
from pathlib import Path

import pandas as pd
import numpy as np
import pickle

from lightfm import LightFM
from lightfm.data import Dataset
from sklearn.base import clone

from ast import literal_eval


class NoFiles(Exception):
    pass


class Mappings:
    def __init__(self, dataset: Dataset) -> None:
        """
        userid: user_id
        row: internal user id
        itemid: recipe_id
        column: internal recipe id
        """
        userid2row, _, itemid2col, _ = dataset.mapping()
        self.userid2row = userid2row
        self.itemid2col = itemid2col
        # Invert dictionaries to get mapping in other direction
        self.row2userid = {value: key for key, value in self.userid2row.items()}
        self.col2itemid = {v: k for k, v in self.itemid2col.items()}


class LightFMResizable(LightFM):
    """A LightFM that resizes the model to accomodate new users,
    items, and features"""

    def fit_partial(
        self,
        interactions,
        user_features=None,
        item_features=None,
        sample_weight=None,
        epochs=1,
        num_threads=1,
        verbose=False,
    ):
        try:
            self._check_initialized()
            self._resize(interactions, user_features, item_features)
        except ValueError:
            # This is the first call so just fit without resizing
            pass

        super().fit_partial(
            interactions,
            user_features,
            item_features,
            sample_weight,
            epochs,
            num_threads,
            verbose,
        )

        return self

    def _resize(self, interactions, user_features=None, item_features=None):
        """Resizes the model to accommodate new users/items/features"""

        no_components = self.no_components
        no_user_features, no_item_features = interactions.shape  # default

        if hasattr(user_features, "shape"):
            no_user_features = user_features.shape[-1]
        if hasattr(item_features, "shape"):
            no_item_features = item_features.shape[-1]

        if (
            no_user_features == self.user_embeddings.shape[0]
            and no_item_features == self.item_embeddings.shape[0]
        ):
            return self

        new_model = clone(self)
        new_model._initialize(no_components, no_item_features, no_user_features)

        # update all attributes from self._check_initialized
        for attr in (
            "item_embeddings",
            "item_embedding_gradients",
            "item_embedding_momentum",
            "item_biases",
            "item_bias_gradients",
            "item_bias_momentum",
            "user_embeddings",
            "user_embedding_gradients",
            "user_embedding_momentum",
            "user_biases",
            "user_bias_gradients",
            "user_bias_momentum",
        ):
            # extend attribute matrices with new rows/cols from
            # freshly initialized model with right shape
            old_array = getattr(self, attr)
            old_slice = [slice(None, i) for i in old_array.shape]
            new_array = getattr(new_model, attr)
            new_array[tuple(old_slice)] = old_array
            setattr(self, attr, new_array)

        return self


def get_top_sorted(scores: np.ndarray, top_n):
    """
    Get the top indices sorted descendingly from the scores list array.
    Args:
    scores: An array with scores.
    top_n: The number of top scores to be returned.
    Returns:
        ScoringList: The first element of the tuple is the index where the score was
                in the original array, the second element is the score itself.
    """
    best_idxs = np.argpartition(scores, -top_n)[-top_n:]
    return sorted(zip(best_idxs, scores[best_idxs]), key=lambda x: -x[1])


def load_data(path=""):
    """
    Loads the following files:
        raw_recipes
        model    Params:
        path: Path to folder with the files. If path="", files must be in the same folder as this notebook.
    """
    # try:
    raw_recipes = pd.read_csv(
        os.path.join(path, "RAW_recipes.csv"),
        sep=",",
        usecols=[
            "name",
            "id",
            "minutes",
            "tags",
            "n_steps",
            "steps",
            "ingredients",
            "n_ingredients",
        ],
    )
    filename = "dataset.pkl"
    with open(os.path.join(path, filename), "rb") as file:
        dataset = pickle.load(file)
    filename = "recmodel.pkl"
    with open(os.path.join(path, filename), "rb") as file:
        model = pickle.load(file)
    # except Exception as e:
    #     # print(str(e))
    #     raise NoFiles("DS files are not yet downloaded")
    mappings = Mappings(dataset)
    return raw_recipes, mappings, model, dataset


def send_json(dict):
    # with open(Path(os.getcwd()) / filename, "w") as f:
    #     json.dump(recipe, f)
    print(json.dumps(dict))  # send via console output


def get_recipe(nbr=0):
    # example from https://www.kaggle.com/shuyangli94/food-com-recipes-and-user-interactions?select=RAW_recipes.csv
    # recipe = {"Ingredients": ["Apple", "Banana"], "Steps": "Do that..."}
    recipe = [
        {
            "name": "arriba baked winter squash mexican style",
            "id": 137739,
            "minutes": 55,
            "nutrition": [51.5, 0.0, 13.0, 0.0, 2.0, 0.0, 4.0],
            "steps": [
                "make a choice and proceed with recipe",
                "depending on size of squash , cut into half or fourths",
            ],
            "description": "autumn is my favorite time of year to cook! this recipe can be prepared either spicy or sweet",
        },
        {
            "name": "a bit different breakfast pizza",
            "id": 31490,
            "minutes": 30,
            "nutrition": [173.4, 18.0, 0.0, 17.0, 22.0, 35.0, 1.0],
            "steps": [
                "preheat oven to 425 degrees f",
                "press dough into the bottom and sides of a 12 inch pizza pan",
            ],
            "description": "this recipe calls for the crust to be prebaked a bit before adding ingredients. feel free to change",
        },
        {
            "name": "arriba baked winter squash mexican style",
            "id": 137739,
            "minutes": 55,
            "nutrition": [51.5, 0.0, 13.0, 0.0, 2.0, 0.0, 4.0],
            "steps": [
                "make a choice and proceed with recipe",
                "depending on size of squash , cut into half or fourths",
            ],
            "description": "autumn is my favorite time of year to cook! this recipe can be prepared either spicy or sweet",
        },
    ]
    return recipe[:nbr]


def get_recipes(a, new_user_recipe_id, path):
    """
    Input:
    a: number of recommendations you want
    new_user_recipe_ids: list 5 liked recipe_id
    path: Path to folder with the files. If path="", files must be in the same folder as this notebook
    Output:
    output: a recommendations as a json format
    """

    # Load data
    raw_recipes, mappings, model, dataset = load_data(path)

    # fit_partial new user
    new_user = pd.DataFrame(
        {"user_id": [1] * len(new_user_recipe_id), "recipe_id": new_user_recipe_id}
    )
    dataset.fit_partial(users=new_user["user_id"], items=new_user["recipe_id"])
    new_interactions, _ = dataset.build_interactions(new_user.to_records(index=False))
    model.fit_partial(interactions=new_interactions)

    user_id = 1
    # Get the internal id (or: row) for this user, the number of items in the dataset & the scores for each item (for our user)
    user_row = mappings.userid2row[user_id]
    _, n_items = dataset.interactions_shape()
    item_columns = np.arange(n_items)
    scores = model.predict(user_ids=user_row, item_ids=item_columns)

    sorted_scores_top = get_top_sorted(scores, a)

    # Add results to a DataFrame
    recommendations = pd.DataFrame(
        sorted_scores_top, columns=["internal_item_id", "score"]
    )
    recommendations["user_id"] = user_id
    recommendations["id"] = recommendations["internal_item_id"].apply(
        lambda x: mappings.col2itemid[x]
    )
    recommendations = recommendations[["user_id", "id", "score"]]

    to_adrian = recommendations.set_index("id").join(raw_recipes.set_index("id"))
    to_adrian.drop(["n_ingredients"], axis=1, inplace=True)
    to_adrian.drop(["n_steps"], axis=1, inplace=True)
    to_adrian.drop(["user_id"], axis=1, inplace=True)
    to_adrian.drop(["score"], axis=1, inplace=True)
    to_adrian.reset_index(inplace=True)
    to_adrian["steps"] = to_adrian["steps"].apply(literal_eval)
    to_adrian["tags"] = to_adrian["tags"].apply(literal_eval)
    to_adrian["ingredients"] = to_adrian["ingredients"].apply(literal_eval)
    # Convert to json
    output = to_adrian.to_json(orient="records")

    return output


def hardcodedRecipes():
    recipe_idx = 3
    if len(sys.argv) > 1:
        recipe_idx = int(sys.argv[1])
    recipe = get_recipe(recipe_idx)
    send_json(recipe)


if len(sys.argv) < 2:
    hardcodedRecipes()
else:
    new_user_recipe_id = [4065, 10123, 295797, 108524, 10045]
    nbr_recipes = int(sys.argv[1])
    if len(sys.argv) >= 3:
        raw_idxs = sys.argv[2]
        new_user_recipe_id = list(
            map(int, raw_idxs.strip("[]").split(","))
        )  # input as: [1,3,4]
    try:
        recipe = get_recipes(
            nbr_recipes,
            new_user_recipe_id,
            os.path.join(os.getcwd(), "src", "data-science"),
        )
        # recipe = get_recipes(
        #     3, new_user_recipe_id, os.path.join(os.getcwd(), "src", "data-science")
        # )
        print(recipe)
    except Exception as e:
        send_json({"error": str(e)})
sys.stdout.flush()
