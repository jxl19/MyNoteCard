const passport = require('passport');

exports.login = passport.authenticate('local', {
   failureRedirect: '/',
   failureFlash: 'Failed login',
   successRedirect: '/notecard',
   successFlash: 'You are now logged in'  
});

exports.logout = (req,res) => {
    req.logout();
    req.flash('success', 'You are now logged out');
    res.redirect('/');
}

// exports.isLoggedIn = (req,res,next) => {
//     if( req.isAuthenticated())  {
//         next();
//         return;
//     }
//     req.flash('error', 'You must be logged in to do that!');
//     req.redirect('/');
// }