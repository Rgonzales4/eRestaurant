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

  // await db.collection('users').findOne({ email: req.body.email }, function (doc, err) {
  //   if (doc) {
  //     try {
  //       await user.save();
  //       res.render('registration', {
  //         successMessage: 'Successfully Registered',
  //         failMessage: '',
  //       });
  //     } catch (e) {
  //       console.log(e);
  //       res.sendStatus(200);
  //     }
  //   } else {
  //     console.log('User already exists');
  //     res.render('registration', {
  //       failMessage: 'User is already registered under this email',
  //       successMessage: '',
  //     });
  //   }
  //});

  // const cursor = db.collection('users').find();
  // const resultArray = [];
  // cursor.forEach(function (doc, err) {
  //   try {
  //     resultArray.push(doc);
  //     console.log(resultArray);
  //   } catch (err) {
  //     console.log(err);
  //     res.sendStatus(200);
  //   }
  // });
  // console.log(
  //   !!resultArray.find((user) => {
  //     return email === req.body.email;
  //   })
  // );
  // if (!!resultArray.find(user.email)) {
  //   console.log('user not found');
  // }

  // await db.collection('users').find(user, function (err, doc) {
  //   console.log(doc);
  //   if (!doc) {
  //     console.log('working');
  //     res.render('registration', {
  //       successMessage: 'Successfully registered',
  //       failMessage: '',
  //     });
  //   } else {
  //     console.log('user already registered');
  //     res.render('registration', {
  //       failMessage: 'User already registered under that email',
  //       successMessage: '',
  //     });
  //   }
  // });

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
