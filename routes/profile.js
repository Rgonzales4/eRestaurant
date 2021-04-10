const express = require('express');
const router = express.Router();

const User = require('../models/users');

router.get('/', checkAuthenticated, async (req, res) => {
  const userAccount = await User.findOne({ email: req.user.email });
  console.log(`User ${userAccount.userId} page open`);
  res.render('profile', { req: req, user: userAccount });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

function checkAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin === true) {
    return next();
  }
  res.redirect('/');
}

module.exports = router;
