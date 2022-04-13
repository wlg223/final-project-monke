const express = require('express');
const router = express.Router();
 
const passport = require('passport');

router.get('/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));

router.get( '/google/callback',
  passport.authenticate( 'google', {
    successRedirect: '/',
    failureRedirect: '/error'
  })
);

router.get("/logout", (req, res) => {
    req.logout();
    req.session.destroy();
    global.loggedin = false;
    res.redirect('/');
});


module.exports = router;

