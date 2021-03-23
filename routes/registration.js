const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  console.log('Registration page opened');
  res.render('registration', { message: '' });
});

const User = require('./../models/users');

router.post('/', async (req, res) => {
  console.log(req.body);
  const { email, password, firstName, lastName } = req.body;
  const user = new User({ email, password, firstName, lastName });
  try {
    await user.save();
    res.render('registration', { message: 'Successfully Registered' });
  } catch (e) {
    console.log(e);
    res.sendStatus(200);
  }
});

module.exports = router;
