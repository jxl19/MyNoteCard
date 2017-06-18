'use strict';
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { BasicStrategy } = require('passport-http');
const bodyParser = require('body-parser');
const router = express.Router();
router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({ extended: true }));
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { Notecard, User } = require('../models');
const bcrypt = require('bcryptjs');


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
    console.log('amiinhere');
    process.nextTick(function () {
      console.log('processnexttck');
      User.findOne({ email: email }, function (err, user) {
        console.log(req.body.email);
        console.log(user);
        console.log(email);
        if (err) {
          console.log('err');
          return done(err);
        }
        if (!user) {
          console.log('!user');
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (user.validatePassword(password)) {
          console.log(user);
          console.log('right pass')
          console.log(password);
          console.log(req.body.password);
          return done(null, user);
        }
        else if (!user.validatePassword(password)) {
          return done(null, false, { message: 'Invalid passowrd' });
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

//https://www.dropbox.com/sh/o6bdknh5v0cx05n/AABIl_My_DxueqE5mxKbUcRWa?dl=0