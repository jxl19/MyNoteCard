'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');
const validator = require('validator');
mongoose.Promise = global.Promise;
//validator good package to validate emails - node lesson 23, 10min

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Invalid Email Address'],
    required: 'Please supply an email address'
  },
  name: {
    type: String,
    trim: true,
    required: 'Please enter a name'
  },
  score: {
    type: [String]
  }
});
// how to create relatinoship between two schemas
//assosicaet user by specific user by id
userSchema.plugin(passportLocalMongoose, {usernameField: 'email'});
userSchema.plugin(mongodbErrorHandler);

const User = mongoose.model('User', userSchema);

const noteCardSchema = mongoose.Schema({
    username: {type:String, required:true},
    title: {type: String, required: true},
    category: {type: String, required: true},
    definition: {type: String, required: true},
    color: {type: String, required:true},
    tags: [String]
   
});

noteCardSchema.methods.apiResponse = function() {
  return {
    id: this._id,
    username: this.username,
    title: this.title,
    category: this.category,
    definition: this.definition,
    color: this.color,
    tags: this.tags
   }
}

const NoteCard = mongoose.model('NoteCardSchema', noteCardSchema);

module.exports = {NoteCard, User};