const DButils = require("./DButils.js");

async function getPersonalRecipeInstructions(recipe_id) {
  try {
    var instructions_in_order = await DButils.execQuery(
      `SELECT instruction FROM [dbo].[personal_recipes_instructions] WHERE recipe_id= '${recipe_id}' ORDER BY step_num ASC`
    );

    var instruction_arr = [];
    if (!instructions_in_order || instructions_in_order.length == 0) {
      return instruction_arr;
    }
    var j;
    for (j = 0; j < instructions_in_order.length; j++) {
      instruction_arr.push(instructions_in_order[j].instruction);
    }
  } catch (err) {
    throw err;
  }

  return instruction_arr;
}

async function getPersonalRecipeIngrediantes(recipe_id) {
  try {
    var ingrediantes_in_order = await DButils.execQuery(
      `SELECT ingredient FROM [dbo].[personal_recipes_ingredients] WHERE recipe_id= '${recipe_id}' ORDER BY [index] ASC`
    );

    var ingredient_arr = [];
    if (!ingrediantes_in_order || ingrediantes_in_order.length == 0) {
      return ingredient_arr;
    }
    var index;
    for (index = 0; index < ingrediantes_in_order.length; index++) {
      ingredient_arr.push(ingrediantes_in_order[index].ingredient);
    }
  } catch (err) {
    throw err;
  }

  return ingredient_arr;
}

async function getAllPersonalRecipeSummary(user_id) {
  try {
    var all_personal_recipes = await DButils.execQuery(
      `SELECT * FROM [dbo].[personal_recipes] WHERE author='${user_id}'`
    );

    if (!all_personal_recipes) {
      throw { status: 401, message: "SQL returned empty" };
    }
    var dict = {};
    var i;
    for (i = 0; i < all_personal_recipes.length; i++) {
      const {
        recipe_id,
        title,
        readyInMinutes,
        vegetarian,
        vegan,
        glutenFree,
        image,
        servings,
      } = all_personal_recipes[i];

      dict[recipe_id] = new Object();
      dict[recipe_id].title = title;
      dict[recipe_id].readyInMinutes = readyInMinutes;
      dict[recipe_id].vegetarian = vegetarian;
      dict[recipe_id].vegan = vegan;
      dict[recipe_id].glutenFree = glutenFree;
      dict[recipe_id].image = image;
    }
  } catch (err) {
    throw err;
  }

  return dict;
}

async function getFullPersonalRecipe(id_recipe, user_id) {
  var personal_rec = id_recipe;
  try {
    var personal_recipe_info = (
      await DButils.execQuery(
        `SELECT * FROM [dbo].[personal_recipes] WHERE recipe_id='${personal_rec}' AND author='${user_id}'`
      )
    )[0];
    console.log(id_recipe);
    console.log(personal_rec);
    console.log(user_id);
    if (!personal_recipe_info) {
      throw { status: 401, message: "SQL returned empty" };
    }
    const {
      recipe_id,
      title,
      readyInMinutes,
      vegetarian,
      vegan,
      glutenFree,
      image,
      servings,
    } = personal_recipe_info;

    return {
      // return object
      id: recipe_id,
      title: title,
      readyInMinutes: readyInMinutes,
      vegetarian: vegetarian,
      vegan: vegan,
      glutenFree: glutenFree,
      image: image,
      servings: servings,
      instructions: await getPersonalRecipeInstructions(recipe_id),
      ingredients: await getPersonalRecipeIngrediantes(recipe_id),
    };
  } catch (err) {
    throw err;
  }
}

exports.getAllPersonalRecipeSummary = getAllPersonalRecipeSummary;
exports.getFullPersonalRecipe = getFullPersonalRecipe;
