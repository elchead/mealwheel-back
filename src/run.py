import json
import sys
import os
from pathlib import Path


def send_json(dict, filename):
    # with open(Path(os.getcwd()) / filename, "w") as f:
    #     json.dump(recipe, f)
    print(json.dumps(dict))  # send via console output


def get_recipe(idx=0):
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
    return recipe


recipe_idx = 0
if len(sys.argv) != 1:
    recipe_idx = sys.argv[1]
recipe = get_recipe(recipe_idx)
send_json(recipe, "data/recipe.json")
sys.stdout.flush()
