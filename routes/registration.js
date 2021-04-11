require('dotenv/config');

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

router.get('/', checkNotAuthenticated, (req, res) => {
  console.log('Registration page opened');
  res.render('registration', { successMessage: '', failMessage: '', req: req });
});

const User = require('./../models/users');

router.post('/', async (req, res) => {
  //const { email, password, firstName, lastName } = req.body;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const newUser = new User({
    userId: Date.now().toString(),
    email: req.body.email,
    //password: req.body.password,
    password: hashedPassword,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    isAdmin: false,
  });

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    res.render('registration', {
      failMessage: 'Email has already been registered',
      successMessage: '',
      req: req,
    });
  } else {
    await newUser.save();
    res.render('registration', {
      successMessage: 'Successfully Registered',
      failMessage: '',
      req: req,
    });
  }
});

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/');
  }
  next();
}

module.exports = router;
