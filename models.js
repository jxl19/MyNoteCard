'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');
const md5 = require('md5');
const validator = require('validator');
mongoose.Promise = global.Promise;
//validator good package to validate emails - node lesson 23, 10min
const noteCardSchema = mongoose.Schema({
    username: {type: String, required: true},
    title: {type: String, required: true},
    category: {type: String, required: true},
    definition: {type: String, required: true},
    color: {type: String, required:true},
    tags: Array
   
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
  }
});

// userSchema.methods.validatePassword = function(password){
//   return bcrypt.compare(password, this.password);
// }

// userSchema.statics.hashPassword = function(password) {
//   return bcrypt.hash(password,10);
// }

userSchema.plugin(passportLocalMongoose, {usernameField: 'email'});
userSchema.plugin(mongodbErrorHandler);

const User = mongoose.model('User', userSchema);

module.exports = {NoteCard, User};