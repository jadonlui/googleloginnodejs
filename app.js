var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
var logger = require("morgan");
var cors = require("cors");
var session = require('express-session');
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

const authRouter = require("./routes/auth");

var app = express();

app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }
}));

passport.use(
  new GoogleStrategy(
    {
      //input google id
      clientID:
        "443564131278-c7pkbbkgp2vl8a4c2iar32e9ghtdu8qa.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, cb) => {
     
      return cb(null, profile);
    }
  )
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
