const express = require('express');
const router = express.Router();

const User = require('../models/users');

router.get('/', checkAdmin, async (req, res) => {
  console.log('Databasee page opened');
  const Users = await User.find().sort({ firstName: 'asc' });
  res.render('database', { req: req, Users: Users });
});

function checkAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin === true) {
    return next();
  }
  res.redirect('/');
}

module.exports = router;
