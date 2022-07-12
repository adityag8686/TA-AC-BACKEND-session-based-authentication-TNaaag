var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var User = require('../models/User');

/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log(req.session);
  res.render('users');
});

router.get('/register', (req, res, next) => {
  res.render('register');
});

router.post('/register', (req, res, next) => {
  console.log(req.body);
  User.create(req.body, (err, user) => {
    console.log(err, user, 'User Created');
    res.redirect('/users/login');
  });
});

// Route for handling login

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    res.redirect('/users/login');
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    // no user
    if (!user) {
      return res.redirect('/users/login');
    }
    // compare password
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        res.redirect('/users/login');
      }
      // persist loggedin user
      req.session.userId = user.id;
      res.redirect('/users');
    });
  });
});

module.exports = router;