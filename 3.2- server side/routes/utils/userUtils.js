const DButils = require("./DButils.js");

async function checkIDinDB(id) {
  const user = (
    await DButils.execQuery(`SELECT * FROM dbo.users WHERE user_id = '${id}'`)
  )[0];
  return user;
}

async function getInfoOnRecipesForUser(user_id, recipeIDs_arr) {
  var dict = {};
  try {
    var favorite_recipes_for_user = await DButils.execQuery(
      `SELECT recipe_id FROM dbo.favorite_recipes WHERE author = '${user_id}'`
    );
    var watched_recipes_for_user = await DButils.execQuery(
      `SELECT recipe_id FROM dbo.last_watched_recipes WHERE author = '${user_id}'`
    );

    var curr_watched = false;
    var curr_favorite = false;
    var recipe;
    var i;
    for (i = 0; i < recipeIDs_arr.length; i++) {
      curr_watched = false;
      curr_favorite = false;
      recipe = recipeIDs_arr[i];
      if (
        favorite_recipes_for_user &&
        recipeInFavorites(recipe, favorite_recipes_for_user)
      ) {
        curr_favorite = true;
      }
      if (
        watched_recipes_for_user &&
        recipeInWatch(recipe, watched_recipes_for_user)
      ) {
        curr_watched = true;
      }

      dict[recipe] = new Object();
      dict[recipe].watched = curr_watched;
      dict[recipe].favorite = curr_favorite;
    }
  } catch (err) {
    throw err;
  }

  return dict;
}

async function addRecipeToWatched(user_id, recipe_id) {
  try {
    var recipe_in_watched = await DButils.execQuery(
      `SELECT * FROM [dbo].[last_watched_recipes] WHERE author= '${user_id}' AND recipe_id='${recipe_id}'`
    );
    //if allready in database
    if (recipe_in_watched && recipe_in_watched.length > 0) {
      await DButils.execQuery(
        `UPDATE dbo.last_watched_recipes SET time = default WHERE author='${user_id}' AND recipe_id='${recipe_id}'`
      );
    }
    //new row
    else {
      await DButils.execQuery(
        `INSERT INTO dbo.last_watched_recipes VALUES ('${recipe_id}', '${user_id}', default)`
      );
    }
  } catch (err) {
    throw err;
  }
}

async function getLast3WatchedRecipes(user_id) {
  try {
    var last_3_recipes = await DButils.execQuery(
      `SELECT TOP (3) recipe_id FROM [dbo].[last_watched_recipes] WHERE author= '${user_id}' ORDER BY time DESC`
    );
    var last_3_recipes_arr = [];
    if (!last_3_recipes || last_3_recipes.length == 0) {
      return last_3_recipes_arr;
    }
    var j;
    for (j = 0; j < last_3_recipes.length; j++) {
      last_3_recipes_arr.push(last_3_recipes[j].recipe_id);
    }
  } catch (err) {
    throw err;
  }
  return last_3_recipes_arr;
}

async function getAllFavortieRecipeID(user_id) {
  try {
    var favorite_recipes = await DButils.execQuery(
      `SELECT recipe_id FROM [dbo].[favorite_recipes] WHERE author='${user_id}'`
    );
    var favorite_recipes_arr = [];
    if (!favorite_recipes || favorite_recipes.length == 0) {
      return favorite_recipes_arr;
    }
    for (let j = 0; j < favorite_recipes.length; j++) {
      favorite_recipes_arr.push(favorite_recipes[j].recipe_id);
    }
  } catch (err) {
    throw err;
  }
  return favorite_recipes_arr;
}

function recipeInFavorites(recipeID, favorite_recipes_arr) {
  for (var j = 0; j < favorite_recipes_arr.length; j++) {
    if (favorite_recipes_arr[j].recipe_id == recipeID) {
      return true;
    }
  }
  return false;
}

function recipeInWatch(recipeID, watched_arr) {
  for (var j = 0; j < watched_arr.length; j++) {
    if (watched_arr[j].recipe_id == recipeID) {
      return true;
    }
  }
  return false;
}

exports.checkIDinDB = checkIDinDB;
exports.getInfoOnRecipesForUser = getInfoOnRecipesForUser;
exports.getLast3WatchedRecipes = getLast3WatchedRecipes;
exports.getAllFavortieRecipeID = getAllFavortieRecipeID;
exports.addRecipeToWatched = addRecipeToWatched;
//getInfoOnRecipesForUser('9cb0b315-df33-4659-b49e-5f88ef42f6ae',[492560, 559251, 630293]);
