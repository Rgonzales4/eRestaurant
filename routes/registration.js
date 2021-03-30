const express = require('express');
const { db } = require('./../models/users');
const router = express.Router();

router.get('/', (req, res) => {
  console.log('Registration page opened');
  res.render('registration', { successMessage: '', failMessage: '' });
});

const User = require('./../models/users');

router.post('/', async (req, res) => {
  //console.log(req.body);
  const { email, password, firstName, lastName } = req.body;
  const newUser = new User({ email, password, firstName, lastName });

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    res.render('registration', {
      failMessage: 'User is already registered under this email',
      successMessage: '',
    });
  } else {
    await newUser.save();
    res.render('registration', {
      successMessage: 'Successfully Registered',
      failMessage: '',
    });
  }

  // ALMOST WORKING CODE!!!
  // const cursor = db.collection('users').find();
  // const resultArray = [];
  // const end = false;
  // cursor.forEach(function (doc, err) {
  //   try {
  //     resultArray.push(doc);
  //     // console.log(resultArray); --> Output all the users
  //     searchResults = !!resultArray.find((user) => {
  //       return user.email == newUser.email;
  //     });
  //     console.log('Does the user exist: ', searchResults); //Check if the user exists in database already
  //     if (searchResults) {
  //       res.render('registration', {
  //         successMessage: '',
  //         failMessage: 'A user is already resgistered under this email',
  //       });
  //     } else {
  //       await newUser.save();
  //       res.render('registration', {
  //         successMessage: 'Successfully Registered',
  //         failMessage: '',
  //       });
  //     }

  //   } catch (err) {
  //     console.log(err);
  //     res.sendStatus(200);
  //   }
  // });

  //WORKING CODE:
  //try {
  //       await newUser.save();
  //       res.render('registration', {
  //         successMessage: 'Successfully Registered',
  //         failMessage: '',
  //       });
  //     } catch (e) {
  //       console.log(e);
  //       res.sendStatus(200);
  //     }
});

module.exports = router;
