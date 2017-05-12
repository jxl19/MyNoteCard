const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

//need test to check for email already used.
exports.validateRegister = (req, res, next) => {
    req.sanitizeBody('name');
    req.checkBody('name', 'You must supply a name!').notEmpty();
    req.checkBody('email', 'You must supply an email!').isEmail();
    req.sanitizeBody('email').normalizeEmail({
        remove_dots: false,
        remove_extensions: false,
        gmail_remove_subaddress: false
    });

    req.checkBody('password', 'Password cannot be blank!').notEmpty();
    req.checkBody('confirm-password', 'Confirmed password cannot be blank!').notEmpty();
    req.checkBody('confirm-password', 'Oops! Your passwords do not match').equals(req.body.password);

    const errors = req.validationErrors();
    if (errors) {
        req.flash('error', errors.map(err => err.msg));
        res.send('signup', { title: 'signup', body: req.body, flashes: req.flash() });
        return;
    }
    next();
};

exports.register = async(req, res, next) => {
    const user = new User({email: req.body.email, name: req.body.name});
    const register = promisify(User.register, User);
    await register(user, req.body.password);
    next();
}
