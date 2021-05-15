const express = require('express');
const router = express.Router();

// Passport Setup
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const flash = require('express-flash');

const initialisePassport = require('./passport-config');
initialisePassport(passport);

express().use(flash());

router.get('/', checkNotAuthenticated, async (req, res) => {
  console.log('Login page opened');
  res.render('login', { loginMessage: '', req: req });
});

router.post(
  '/',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  })
);

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/');
  }
  next();
}

module.exports = router;
