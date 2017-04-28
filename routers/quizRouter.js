'use strict';
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
mongoose.Promise = global.Promise;

const { NoteCard } = require('../models');
router.use(bodyParser.json());














module.exports = router;