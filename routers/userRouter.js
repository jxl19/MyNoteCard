'use strict';
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bodyParser = require('body-parser');
const router = express.Router();
router.use(bodyParser.json());
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { Notecard, User } = require('../models');


//route to add a new unique user
router.post('/signup',
  userController.validateRegister,
  userController.register,
  authController.login
);

router.post('/login', authController.login);





module.exports = router;

//https://www.dropbox.com/sh/o6bdknh5v0cx05n/AABIl_My_DxueqE5mxKbUcRWa?dl=0