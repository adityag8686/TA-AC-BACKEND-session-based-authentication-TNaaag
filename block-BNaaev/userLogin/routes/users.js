var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var User  = require("../models/User")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', (req, res, next) => {
  res.render('register');
});

router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    console.log(err, user, 'User Created');
    res.redirect('login');
  });
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

module.exports = router;
