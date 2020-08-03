const DButils = require("./DButils.js");

async function getFamilyRecipeInstructions(recipe_id) {
  try {
    var instructions_in_order = await DButils.execQuery(
      `SELECT instruction FROM [dbo].[family_recipes_instructions] WHERE recipe_id= '${recipe_id}' ORDER BY step_num ASC`
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

async function getFamilyRecipeIngrediantes(recipe_id) {
  try {
    var ingrediantes_in_order = await DButils.execQuery(
      `SELECT ingredient FROM [dbo].[family_recipes_ingredients] WHERE recipe_id= '${recipe_id}' ORDER BY [index] ASC`
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

async function getFullFamilyRecipe(recipe_id, user_id) {
  var personal_rec = recipe_id;
  try {
    var family_recipe = (
      await DButils.execQuery(
        `SELECT * FROM [dbo].[family_recipes] WHERE author='${user_id}' AND recipe_id='${personal_rec}'`
      )
    )[0];

    if (!family_recipe) {
      throw { status: 401, message: "SQL returned empty" };
    }
    //var dict={};

    const {
      recipe_id,
      author,
      recipe_name,
      family_member,
      when_make,
      image,
    } = family_recipe;

    return {
      // return object
      id: recipe_id,
      recipe_name: recipe_name,
      family_member: family_member,
      when_make: when_make,
      image: image,
      instructions: await getFamilyRecipeInstructions(recipe_id),
      ingredients: await getFamilyRecipeIngrediantes(recipe_id),
    };
  } catch (err) {
    throw err;
  }
}

async function getAllFamilyRecipeSummary(user_id) {
  try {
    var all_family_recipes = await DButils.execQuery(
      `SELECT * FROM [dbo].[family_recipes] WHERE author='${user_id}'`
    );

    if (!all_family_recipes) {
      throw { status: 401, message: "SQL returned empty" };
    }
    var dict = {};
    var i;
    for (i = 0; i < all_family_recipes.length; i++) {
      const {
        recipe_id,
        author,
        recipe_name,
        family_member,
        when_make,
        image,
      } = all_family_recipes[i];

      dict[recipe_id] = new Object();
      dict[recipe_id].recipe_name = recipe_name;
      dict[recipe_id].family_member = family_member;
      dict[recipe_id].when_make = when_make;
      dict[recipe_id].image = image;
      //dict[recipe_id].ingredients= await getFamilyRecipeIngrediantes(recipe_id);
      //dict[recipe_id].instructions= await getFamilyRecipeInstructions(recipe_id);
    }
  } catch (err) {
    throw err;
  }

  return dict;
}

exports.getFullFamilyRecipe = getFullFamilyRecipe;
exports.getAllFamilyRecipeSummary = getAllFamilyRecipeSummary;
