const express = require('express');
const router = express.Router();

const User = require('../models/users');

router.get('/', checkAuthenticated, async (req, res) => {
  const userAccount = await User.findOne({ email: req.user.email });
  console.log(`User ${userAccount.userId} page open`);
  res.render('account', { req: req, user: userAccount });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
