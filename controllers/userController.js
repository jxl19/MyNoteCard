const mongoose = require('mongoose');
const { User } = require('../models')
const passport = require('passport');

exports.register = (req, res) => {
    console.log("registering a user");
    User
        .find({ email: req.body.email })
        .count()
        .exec()
        .then(count => {
            if (count > 0) {
                console.log('reject');
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
            req.login(user, function (err) {
                console.log('register success');
                if (err) { return next(err); }
                req.session.username = req.user.email;
                return res.redirect('/notecard');
            });
        })
        .catch(err => {
            if (err.name === 'AuthenicationError') {
                return res.status(422).json({ message: err.message })
            }
            console.log(err.error);
            console.log(err.message);
            console.log(err.name);
            res.status(500).json({ message: err.error })
        })
}

exports.logout = (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
}
