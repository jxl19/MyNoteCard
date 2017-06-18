const mongoose = require('mongoose');
const { User } = require('../models')
const promisify = require('es6-promisify');
const passport = require('passport');
const { BasicStrategy } = require('passport-http');


exports.register = (req, res) => {
    console.log("registering a user");
    var promise = User
        .find({ email: req.body.email })
        .count()
        .exec()
        .then(count => {
            if (count > 0) {
                return Promise.reject({
                    name: 'AuthenicationError',
                    message: 'email already registered'
                });
            }
            return User.hashPassword(req.body.password)
        })

        .then(hash => {
            return User
                .create({
                    email: req.body.email,
                    name: req.body.name,
                    password: hash
                })
        })
        .then(user => {
            //login after creating new user
            console.log(user);
            req.login(user, function (err) {
                if (err) { return next(err); }
                req.session.username = req.user.email;
                return res.redirect('/notecard');
            });
        })
        .catch(err => {
            if (err.name === 'AuthenicationError') {
                return res.status(422).json({ message: err.message })
            }
            res.status(500).json({ message: 'Internal Server Error' })
        })
    promise.then(function (user) {
        console.log(user);
        res.end(JSON.stringify(user));
    }, function (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    });
}

exports.logout = (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
}
