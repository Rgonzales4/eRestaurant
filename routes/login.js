const express = require('express');
const router = express.Router();

// Passport Setup
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const flash = require('express-flash');

const initialisePassport = require('./passport-config');
initialisePassport(passport);

express().use(flash());

router.get('/', checkNotAuthenticated, (req, res) => {
  console.log('Login page opened');
  res.render('login', { loginMessage: '', req: req });
});

// WORKING SOLUTION w/o Passport --> Need to import User model again for this to work
// router.post('/', async (req, res) => {
//   let user = await User.findOne({
//     email: req.body.email,
//     password: req.body.password,
//   });
//   if (user) {
//     res.render('home');
//   } else {
//     res.render('login', { loginMessage: 'Username / Password is incorrect' });
//   }
// });

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
