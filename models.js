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
    // validate: [{ validator: value => isEmail(value), msg: 'Invalid email.' }],
    required: 'Please supply an email address'
  },
  name: {
    type: String,
    trim: true,
    required: 'Please enter a name'
  },
  notecards: [{type:mongoose.Schema.Types.ObjectId, ref: 'NoteCard'}]
});

userSchema.plugin(passportLocalMongoose, {usernameField: 'email'});
userSchema.plugin(mongodbErrorHandler);

const User = mongoose.model('User', userSchema);

const noteCardSchema = mongoose.Schema({
    username: [{type:mongoose.Schema.Types.ObjectId, ref: 'User'}],
    title: {type: String, required: true},
    category: {type: String, required: true},
    definition: {type: String, required: true}, 
    color: {type: String, required:true},
});

noteCardSchema.methods.apiResponse = function() {
  return {
    id: this._id,
    username: this.username,
    title: this.title,
    category: this.category,
    definition: this.definition,
    color: this.color,
   }
}

const NoteCard = mongoose.model('NoteCardSchema', noteCardSchema);

module.exports = {NoteCard, User};