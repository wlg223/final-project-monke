const express = require('express');
const Trainer = require('../models/Trainer.js');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let user = "";
  if(loggedin){
    user = req.session.passport.user
  }
  res.render('index', {title: "Pokeroll", loggedin: loggedin, username: user})
});

router.get('/error', function(req, res, next) {
  res.render('error', { title: 'Error' });
});

module.exports = router;
