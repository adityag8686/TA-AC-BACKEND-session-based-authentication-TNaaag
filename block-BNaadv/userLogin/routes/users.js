var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var User = require('../models/User');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('users');
});

router.get('/register', (req, res, next) => {
  var error = req.flash('error')[0];
  res.render('register', { error });
});

router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    console.log(user);
    console.log(err, user, 'User Created');
    if (!user.email) {
      req.flash('error', 'Email is not unique');
      return res.redirect('/login');
    }
    if (user.password.length < 4) {
      req.flash('error', 'Password length must be 5 or password >5');
      return res.redirect('/login');
    }
    res.redirect('/login');
  });
});

// Route for handling login

router.get('/login', (req, res, next) => {
  var error = req.flash('error')[0];
  res.render('login', { error });
});

router.post('/login', (req, res, next) => {
  var { email, password } = req.body;
  console.log(email, password);
  if (!email || !password) {
    req.flash('error', 'Email/Passsword is required');
    return res.redirect('/users/login');
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

// Logout

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/users/login');
});

module.exports = router;