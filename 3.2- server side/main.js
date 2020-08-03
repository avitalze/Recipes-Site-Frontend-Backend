//---libaries importing
var express = require("express");
var path = require("path");
var logger = require("morgan");
const session = require("client-sessions");
const DButils = require("./routes/utils/DButils.js");
const cors = require("cors");

const bodyParser = require("body-parser");
const morgan = require("morgan"); // add request logs
require("dotenv").config();

//--- routes importing
const user = require("./routes/user");
const profile = require("./routes/profile");
const recipe = require("./routes/recipe");

//--- App setting and config
var port = process.env.PORT || "3000";
var app = express();

// Letting all origins to pass
// app.use(cors());
const corsConfig = {
  origin: true,
  credentials: true,
};

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

//--- middle Wares
app.use(logger("dev")); //logger

app.use(express.json()); // parse application/json

app.use(morgan("method :url :status   :response-time ms")); // print request logs

app.use(
  session({
    cookieName: "session", // the cookie key name
    secret: process.env.COOKIE_SECRET, // the encryption key
    duration: 20 * 60 * 1000, // expired after 200 min
    activeDuration: 10 * 60 * 1000, // if expiresIn < activeDuration,
    //the session will be extended by activeDuration milliseconds
    cookie: {
      httpOnly: false,
      // path: "/",
    },
  })
);

app.use(express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded

app.use(express.static(path.join(__dirname, "public"))); //To serve static files such as images, CSS files, and JavaScript files

// See if server is alive
app.get("/alive", (req, res) => {
  res.send("I'm alive!");
});

// ---- routing!
app.use("/user", user);
app.use("/profile", profile);
app.use("/recipe", recipe);

// defult router. returns not found
app.use((req, res) => {
  res.sendStatus(404);
});

// error router
app.use(function (err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).send({ message: err.message, success: false });
});

const server = app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
});
