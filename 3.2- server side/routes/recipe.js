var express = require("express");
var router = express.Router();
const axios = require("axios");
axios.defaults.withCredentials = true;

const api_domain = "https://api.spoonacular.com/recipes";
const recipe_util = require("./utils/recipeUtils");

//recipe/search/query/{searhQuery}/amountNum/{num}:
router.get("/search/query/:searchQuery/amount/:num", (req, res) => {
  const { searchQuery, num } = req.params;
  //set search params
  search_params = {};
  search_params.query = searchQuery;
  search_params.number = recipe_util.lagalNumOfSearchRecipes(num);
  search_params.instructionsRequired = true;

  //check if queries params exixts
  //console.log(req.query);
  recipe_util.extreactQueriesParams(req.query, search_params);

  // serch the recipe
  recipe_util
    .searchForRecipes(search_params)
    .then((info_array) => res.send(info_array))
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

//return summery of 3 random recepirs
router.get("/random", (req, res) => {
  //set search params
  search_params = {};
  search_params.number = 3; //num of random recipes

  // get random recipes
  recipe_util
    .getRandomRecipes(search_params)
    .then((random_array) => res.send(random_array))
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

// /recipes/search/{recipeID}:
router.get("/search/id/:recipeID", (req, res) => {
  const { recipeID } = req.params;
  //set search params
  search_params = {};
  search_params.id = recipeID;

  // search the recipe by id
  recipe_util
    .getFullRecipesInfo(search_params.id)
    .then((fullRecipeInfo) => res.send(fullRecipeInfo))
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

module.exports = router;
