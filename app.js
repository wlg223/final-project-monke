var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
var passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const session = require('express-session');

//dotenv.config({ path: '.env.example' });
dotenv.config({ path: '.env' });

var indexRouter = require('./routes/index');
var trainerRouter = require('./routes/trainer');
var pokeRouter = require('./routes/pokemon');
var authRouter = require('./routes/auth');

//dotenv.config({ path: '.env.example' });
dotenv.config({ path: '.env' });
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;
const localhostCallback = 'http://localhost:3000/auth/google/callback';
const herokuCallback = 'https://monke264.herokuapp.com/auth/google/callback';

global.loggedin = false;

function isLoggedIn(req, res, next){
  if (req.user) {
      global.loggedin = true;
      // console.log("logged in?\t" + global.loggedin.toString());
      next();
  } else {
      res.status(401).send({status: "error", message: "Must be logged in to perform this action."});
  }
}

function checklog(req, res, next){
    if (req.user) {
        global.loggedin = true;
        console.log("logged in?\t" + global.loggedin.toString());
    }
    next();
}

var app = express();
const {google} = require('googleapis');

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const Trainer = require('./models/Trainer.js');

// Passport.js
passport.use(new GoogleStrategy({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: herokuCallback,
      passReqToCallback: true,
    },
    async function(request, accessToken, refreshToken, profile, done) {
      let trainerID = await newTrainerID();
      let username = profile.emails[0].value.split('@')[0];
      let trainer = newTrainer(trainerID, username);
      //console.log(trainer);
      Trainer.findOne({username: username}).then((currentUser)=>{
          if(currentUser){
            //if we already have a record with the given profile ID
            done(null, currentUser);
          } else {
            //if not and the return was null, create a new user
            Trainer.create(trainer, function (err, trainer) {
              done(null, trainer);
          });
        }
      })
    }));

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser(function(user, done) {
  Trainer.find({ username: user.username}).then(user => {
      global.loggedin = false;
    done(null, user);
  });
});

app.use(session({
  secret: SESSION_SECRET,
  saveUninitialized: true,
  resave: false
}));
app.use(passport.initialize());
app.use(passport.session());


app.use('/', checklog, indexRouter);
// route to display user info 
app.use('/trainers', isLoggedIn, trainerRouter);
// route to display pokedex info
app.use('/pokemon', checklog, pokeRouter);
// route for authentication
app.use('/auth', checklog, authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use((req, res, next) => {
    res.locals.loggedin = loggedin;
    next()
});


/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;



