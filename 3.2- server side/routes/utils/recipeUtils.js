const axios = require("axios"); // supports promises
const { param } = require("../user");
//spooncailar settings
const recipes_api_url = "https://api.spoonacular.com/recipes";
// a secret - found in .env file
const api_key = "apiKey=" + process.env.spooncular_apiKey;
//"apiKey=44fc27000575446e80d7e554f2e282da";

function extreactQueriesParams(query_params, search_params) {
  // serach _params passed by ref

  // iterate on params list to identify only wanted params
  const params_list = ["diet", "cuisine", "intolerances"];
  params_list.forEach((param) => {
    if (query_params[param]) {
      search_params[param] = query_params[param];
    }
  });
  //console.log(search_params);
}

async function searchForRecipes(search_params) {
  let search_response = await axios.get(
    `${recipes_api_url}/search?${api_key}`,
    {
      params: search_params,
    }
  );
  //console.log(search_params);
  //get only ids from the search
  const recipes_id_list = extracSearchResukttsIds(search_response);
  //get recipes info by id
  let info_array = await getRecipesInfo(recipes_id_list);
  //console.log("info_array: ", info_array);
  return info_array;
}

async function getRandomRecipes(search_params) {
  let arrayOfRandomRecipes = await axios.get(
    `${recipes_api_url}/random?${api_key}`,
    {
      params: search_params,
    }
  );
  var dict = {};
  var check = recipeConatinAllFields(arrayOfRandomRecipes.data.recipes);
  while (check != 0) {
    arrayOfRandomRecipes = await axios.get(
      `${recipes_api_url}/random?${api_key}`,
      {
        params: search_params,
      }
    );
    check = recipeConatinAllFields(arrayOfRandomRecipes.data.recipes);
  }
  //for each recipe -> get relevant information for summery recipe
  arrayOfRandomRecipes.data.recipes.map((recipe) =>
    makeSummryRecipe(recipe, dict)
  );

  return dict;
}

// check if all the random recipes contains all information
function recipeConatinAllFields(arrayOfRandomRecipes) {
  var numOfEmpty = 0;
  arrayOfRandomRecipes.map((recipe) => {
    if (
      recipe.analyzedInstructions == "" ||
      !recipe.instructions ||
      recipe.extendedIngredients == "" ||
      !recipe.extendedIngredients
    ) {
      numOfEmpty = numOfEmpty + 1;
    }
  });
  return numOfEmpty;
}

// get only ids from recipes
function extracSearchResukttsIds(search_response) {
  let recipes = search_response.data.results;
  recipes_id_list = [];
  recipes.map((recipe) => {
    recipes_id_list.push(recipe.id);
  });
  return recipes_id_list;
}

// return information from spoocular on all recpies id
async function getRecipesInfo(recipes_id_list) {
  let promises = [];
  // For each id  -> get promise of GET response
  recipes_id_list.map((id) =>
    promises.push(axios.get(`${recipes_api_url}/${id}/information?${api_key}`))
  );
  let info_response1 = await Promise.all(promises);

  //#region  -------- TODO: try general promiseAll -----------------
  // let url_list = [];
  // recipes_id_list.map((id) =>
  //   url_list.push(`${api_domain}/${id}/information?${api_key}`)
  // );

  // let info_response2 = await promiseAll(axios.get, url_list);

  // console.log(info_response1.toString() == info_response2.toString());
  //#endregion

  var dict = {};
  relevantRecipesData = extractRelevantRecipeData(info_response1, dict);

  return dict;
}

// return full information from spoocular by recpies id
async function getFullRecipesInfo(id) {
  let fullRecipeFromApi = await axios.get(
    `${recipes_api_url}/${id}/information?${api_key}`
  );

  //for each recipe -> get relevant information for full recipe
  fullRcipeInfo = makeFullRecipe(fullRecipeFromApi.data);

  // check if instraction is empty !
  return fullRcipeInfo;
}

// return full detials about recipe (like the scheama)
function makeFullRecipe(recipe) {
  const {
    id,
    title,
    readyInMinutes,
    aggregateLikes,
    vegetarian,
    vegan,
    glutenFree,
    image,
    servings,
  } = recipe;

  let arrInstruction = [];
  //check if instarction are empty
  if (
    recipe.instructions == "" ||
    !recipe.instructions ||
    !recipe.analyzedInstructions ||
    recipe.analyzedInstructions.length == 0
  ) {
    console.log("recipe instructions is empty !!!! ");
  } else {
    // add instractions
    let analyzedInstructions = recipe.analyzedInstructions[0].steps;

    analyzedInstructions.map((crrStep) => arrInstruction.push(crrStep.step));
  }

  let arrIngredients = [];
  if (!recipe.extendedIngredients) {
    console.log("recipe extendedIngredients is empty !!!! ");
  } else {
    // add ingredients
    let extendedIngredients = recipe.extendedIngredients;

    extendedIngredients.map((ingredient) =>
      arrIngredients.push(ingredient.original)
    );
  }

  return {
    // return object
    id: id,
    title: title,
    readyInMinutes: readyInMinutes,
    aggregateLikes: aggregateLikes,
    vegetarian: vegetarian,
    vegan: vegan,
    glutenFree: glutenFree,
    image: image,
    servings: servings,
    instructions: arrInstruction,
    ingredients: arrIngredients,
  };
}

// return summery detials about recipe (like the scheama)
function makeSummryRecipe(recipe, dict) {
  var id = recipe.id;
  //check if instarction are empty
  if (recipe.instructions == "" || !recipe.instructions) {
    console.log("recipe instraction is empty !!!! ");
  }
  if (recipe.extendedIngredients == "" || !recipe.extendedIngredients) {
    console.log("recipe instraction is empty !!!! ");
  }
  dict[id] = new Object();
  dict[id].title = recipe.title;
  dict[id].readyInMinutes = recipe.readyInMinutes;
  dict[id].aggregateLikes = recipe.aggregateLikes;
  dict[id].vegetarian = recipe.vegetarian;
  dict[id].vegan = recipe.vegan;
  dict[id].glutenFree = recipe.glutenFree;
  dict[id].image = recipe.image;
}

function extractRelevantRecipeData(recipes_Info, dict) {
  // for each cell in map (recipe) get relevant information with keys
  return recipes_Info.map((recipe_info) => {
    const {
      id,
      title,
      readyInMinutes,
      aggregateLikes,
      vegetarian,
      vegan,
      glutenFree,
      image,
    } = recipe_info.data;

    dict[id] = new Object();
    dict[id].title = title;
    dict[id].readyInMinutes = readyInMinutes;
    dict[id].aggregateLikes = aggregateLikes;
    dict[id].vegetarian = vegetarian;
    dict[id].vegan = vegan;
    dict[id].glutenFree = glutenFree;
    dict[id].image = image;
  });
}

// General promiseAll implementation
let promiseAll = async function (func, param_list) {
  let promises = [];
  param_list.map((param) => promises.push(func(param)));
  let info_response = await Promise.all(promises);

  return info_response;
};

// fix num of recipe to search - 5/10/15
function lagalNumOfSearchRecipes(num) {
  if (inRange(num, 0, 5)) {
    num = 5;
  } else if (inRange(num, 6, 10)) {
    num = 10;
  } else {
    num = 15;
  }
  return num;
}

// return true if in range, otherwise false
function inRange(x, min, max) {
  return (x - min) * (x - max) <= 0;
}

exports.getRecipesInfo = getRecipesInfo;
exports.extreactQueriesParams = extreactQueriesParams;
exports.searchForRecipes = searchForRecipes;
exports.getRandomRecipes = getRandomRecipes;
exports.getFullRecipesInfo = getFullRecipesInfo;
exports.lagalNumOfSearchRecipes = lagalNumOfSearchRecipes;
