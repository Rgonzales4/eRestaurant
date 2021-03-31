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

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/');
  }
  next();
}

module.exports = router;
