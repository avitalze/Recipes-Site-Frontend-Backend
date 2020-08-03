var express = require("express");
var router = express.Router();
const user_util = require("./utils/userUtils.js");
const DButils = require("./utils/DButils.js");
const recipe_util = require("./utils/recipeUtils");
const family_util = require("./utils/familyUtils");
const personal_util = require("./utils/personalRecipesUtils.js");

//--- cookie authentication for each request on profile!!
router.use(async (req, res, next) => {
  try {
    if (req.session && req.session.id) {
      const id = req.session.id;
      //checkIDinDB not implemented
      const user = await user_util.checkIDinDB(id);

      if (user) {
        req.user = user;
        next(); // move to next midllewear
      }
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    next(error);
  }
});

router.get("/recipeInfo/:ids", async (req, res, next) => {
  try {
    if (!req || !req.params || !req.params.ids) {
      throw { status: 401, message: "parameters missing" };
    }
    const recipeIDs = JSON.parse(req.params.ids);

    const user_id = req.user.user_id;
    const userRecipeData = await user_util.getInfoOnRecipesForUser(
      user_id,
      recipeIDs
    );
    res.send(JSON.stringify(userRecipeData));
  } catch (error) {
    next(error);
  }
});

//checked!
router.get("/getLast3Recipes", async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const recipe_ids = await user_util.getLast3WatchedRecipes(user_id);
    const answer = await recipe_util.getRecipesInfo(recipe_ids);
    res.send(JSON.stringify(answer));
  } catch (error) {
    next(error);
  }
});

//checked!
router.get("/getFavoriteRecipes", async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const recipe_ids = await user_util.getAllFavortieRecipeID(user_id);
    const answer = await recipe_util.getRecipesInfo(recipe_ids);
    res.send(answer);
  } catch (error) {
    next(error);
  }
});

//checked!
router.post("/addRecipeToFavorties", async (req, res, next) => {
  try {
    if (!req.body || !req.body.recipeID) {
      throw { status: 401, message: "parameters missing" };
    }
    const user_id = req.user.user_id;
    const recipeID = req.body.recipeID;
    await DButils.execQuery(
      `INSERT INTO dbo.favorite_recipes VALUES ('${recipeID}', '${user_id}')`
    );
    res.status(200).send({ message: "recipe added succesfuly", success: true });
  } catch (error) {
    next(error);
  }
});

router.get("/getAllFamilyRecipesSummary", async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const answer = await family_util.getAllFamilyRecipeSummary(user_id);
    res.send(answer);
  } catch (error) {
    next(error);
  }
});

router.get("/getFullFamilyRecipe/id/:id", async (req, res, next) => {
  try {
    if (!req.params || !req.params.id) {
      throw { status: 401, message: "parameters missing" };
    }
    const user_id = req.user.user_id;
    const recipeID = req.params.id;
    const answer = await family_util.getFullFamilyRecipe(recipeID, user_id);
    res.send(answer);
  } catch (error) {
    next(error);
  }
});
router.get("/getAllPersonalRecipesSummary", async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const answer = await personal_util.getAllPersonalRecipeSummary(user_id);
    res.send(answer);
  } catch (error) {
    next(error);
  }
});

router.get("/getFullPersonalRecipe/id/:id", async (req, res, next) => {
  try {
    if (!req.params || !req.params.id) {
      throw { status: 401, message: "parameters missing" };
    }
    const recipeID = req.params.id;
    const user_id = req.user.user_id;
    // const recipeID = req.params.id;
    const answer = await personal_util.getFullPersonalRecipe(recipeID, user_id);
    res.send(answer);
  } catch (error) {
    next(error);
  }
});

router.post("/addRecipeToWatched", async (req, res, next) => {
  try {
    if (!req.body || !req.body.recipeID) {
      throw { status: 401, message: "parameters missing" };
    }
    const user_id = req.user.user_id;
    const recipeID = req.body.recipeID;
    await user_util.addRecipeToWatched(user_id, recipeID);
    res.status(200).send({ message: "recipe added succesfuly", success: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
