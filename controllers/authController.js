const passport = require('passport');
const mongoose = require('mongoose');
const {User} = require('../models')
const promisify = require('es6-promisify');

exports.login = passport.authenticate('local'), (req,res) => {
    console.log('test');
    res.redirect('/notecard');
};

exports.logout = (req,res) => {
    req.logout();
    req.flash('success', 'You are now logged out');
    res.redirect('/');
}



// exports.login = passport.authenticate('local', {
//    failureRedirect: '/',
//    failureFlash: 'Failed login',
//    successRedirect: '/notecard',
//    successFlash: 'You are now logged in'  
// });