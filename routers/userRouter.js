const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const router = express.Router();
router.use(bodyParser.json());
const userController = require('../controllers/userController');
const { Notecard, User } = require('../models');

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

//route to add a new unique user
router.post('/signup', userController.register);

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
},
  function (req, email, password, done) {
    process.nextTick(function () {
      User.findOne({ email: email }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, req.flash('error', 'Invalid username or password'));
        }
        if (user.validatePassword(password)) {
          return done(null, user);
        }
        else if (!user.validatePassword(password)) {
          return done(null, false, req.flash('error', 'Invalid username or password'));
        }
      });
    })
  }
))

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
);

module.exports = router;
