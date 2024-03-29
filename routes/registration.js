require('dotenv/config');

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');

const User = require('./../models/users');

router.get('/', checkNotAuthenticated, (req, res) => {
  console.log('Registration page opened');
  res.render('registration', { successMessage: '', failMessage: '', req: req });
});

//REGISTRATION WITHOUT EMAIL VERIFICATION:
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

//REGISTRATION WITH EMAIL VERIFICATION:
const smtpTransport = nodemailer.createTransport('SMTP', {
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS, // need to change this to the restaurant email
    pass: process.env.EMAIL_ADDRESS_PASSWORD, // need to change this to the restaurant password
  },
});

let rand, mailOptions, host, link;

router.get('/processing', async (req, res) => {
  let user = await User.findOne({ email: req.query.email });
  if (user) {
    console.log('Email exists in database');
    res.redirect('/registration/failed');
    return;
  } else {
    console.log('Sending email in process...');
    console.log(req.query);
    rand = Math.floor(Math.random() * 100 + 54);
    host = req.get('host');
    link = 'http://' + req.get('host') + '/registration' + '/verify?id=' + rand;
    const hashedPassword = await bcrypt.hash(req.query.password, 10);
    mailOptions = {
      to: req.query.email,
      subject: 'Please confirm your Email account',
      html:
        '<body>' +
        '<div style="width: 100%; height: 170px; background-color: #0c2a0a">' +
        '<div style="width: 100%;"> <p style="text-align: center; padding-top: 20px; font-size:90px; color: rgb(255, 245, 235);">  Le Bistrot d<span>&#8217;</span>Andre </p> </div>' +
        '</div>' +
        '<div style="background-color: rgb(255, 245, 235); padding: 20px; text-align:center;">' +
        '<div style="color: black; font-size: 30px; padding-top: 40px;">' +
        'Hello, ' +
        '<strong> ' +
        req.query.firstName +
        ' ' +
        req.query.lastName +
        '</strong>' +
        ',<br> To activate your account, please select the link below <br>' +
        '<div style="padding-top: 20px; padding-bottom: 80px;"> <a href=' +
        link +
        '>Click Here </a> </div>' +
        '</div>' +
        '<div style="width: 100%; font-size: 11px;">Once registered, you will be able to access all the perks that come with being part of the Bistro Famille, including table reservation. As outlined in the terms and conditions, tables must be reserved at least one week in advance. If you wish to cancel a booking, please do so a minimum of 24 hours prior to the time of the reservation. Failure to comply with these agreements may result in account suspension or termination. We kindly thank you for your patronage and look forward to seeing you in person.</div>' +
        '<div style="color: grey; font-size: 16px;">' +
        '<br>LBA Online support<br><br><br>' +
        '</div>' +
        '<div style="color: black; font-size: 10px;">' +
        'SES 1A, Group 8' +
        '</div>' +
        '</div>' +
        '<div style="margin: 0; width: 100%; height: 50px; background-color: #0c2a0a"></div>' +
        '</body>',
      userId: Date.now().toString(),
      email: req.query.email,
      password: hashedPassword,
      firstName: req.query.firstName,
      lastName: req.query.lastName,
      isAdmin: false,
    };
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function (error, response) {
      if (error) {
        console.log(error);
        res.end('error');
      } else {
        console.log('Message sent: ' + response.message);
        res.redirect('/registration/email_sent');
      }
    });
  }
});

router.get('/verify', async (req, res) => {
  console.log(req.protocol + ':/' + req.get('host'));
  console.log(mailOptions);
  if (req.protocol + '://' + req.get('host') == 'http://' + host) {
    console.log('Domain is matched. Information is from Authentic email');
    if (req.query.id == rand) {
      console.log('email is verified');
      const newUser = new User({
        userId: mailOptions.userId,
        email: mailOptions.email,
        password: mailOptions.password,
        firstName: mailOptions.firstName,
        lastName: mailOptions.lastName,
        isAdmin: false,
      });
      await newUser.save();
      console.log('User has been successfully registered');
      res.render('message', {
        req: req,
        messageResult: 'Account has been successfully registered',
      });
    } else {
      console.log('email is not verified');
      res.end('<h1>Bad Request</h1>');
    }
  } else {
    res.end('<h1>Request is from unknown source</h1>');
  }
});

router.get('/email_sent', (req, res) => {
  console.log('System Message page opened');
  res.render('message', {
    req: req,
    messageResult: 'Please check your email for the verification link',
  });
});

router.get('/failed', (req, res) => {
  console.log('System Message');
  res.render('registration', {
    failMessage: 'Email has already been registered',
    successMessage: '',
    req: req,
  });
});

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/');
  }
  next();
}

module.exports = router;
