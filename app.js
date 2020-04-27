const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");

const app = express();

//Load routes
const tasks = require("./routes/tasks");
const users = require("./routes/users");

//Passport config
require("./config/passport")(passport);

//DB Config
const db = require("./config/database");

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

// Connect to mongoose
mongoose
  .connect(db.mongoURI, {
    //useMongoClient: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

// Handlebars Middleware
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
  })
);
app.set("view engine", "handlebars");

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//Express Method Override middleware for POST
app.use(methodOverride("_method"));

// Static Folder
app.use(express.static(path.join(__dirname, "public")));

//Express session middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//middleware for flash
app.use(flash());

//passport middleware put after session to get login
app.use(passport.initialize());
app.use(passport.session());

//Globle Variables for flash note
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error"); // this will require for  passport
  res.locals.user = req.user || null;
  next();
});
// Index Route
app.get("/", (req, res) => {
  const title = "Welcome";
  res.render("index", {
    title: title,
  });
});

// About Route
app.get("/about", (req, res) => {
  res.render("about");
});

//Use routes
app.use("/tasks", tasks);
app.use("/users", users);

const port = process.env.PORT || 5000; //when deploy to heroku

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
