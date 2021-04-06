const express = require('express');
const Booking = require('../models/booking');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', checkAuthenticated, async (req, res) => {
  const booking = await Booking.find({ bookingUser: req.user.email });
  res.render('booking', { req: req, booking: booking });
});

router.get('/createBooking', checkAuthenticated, (req, res) => {
  console.log('create booking opened');
  res.render('createBooking', {
    successMessage: '',
    failMessage: '',
    req: req,
    booking: new Booking(),
  });
});

router.post('/', async (req, res) => {
  var date1 = Date.now()
  var date2 = req.body.bookingDate
  const newID = (await Booking.count({})) + 1;
  console.log(newID);
  let booking = new Booking({
    bookingID: newID,
    time: req.body.bookingDate,
    bookingNumber: req.body.bookingNumber,
    allergyDescription: req.body.allergyDescription,
    bookingUser: req.user.email,
  });

  let confirmBookingID = await Booking.findOne({
    bookingID: req.body.bookingID,
  });
  let confirmBookingDate = await Booking.findOne({
    time: req.body.bookingDate,
  });
  if (confirmBookingID) {
    res.render('createBooking', {
      successMessage: '',
      failMessage: 'This booking already exists',
      req: req,
      booking: booking,
    });
    console.log('This booking already exists');
  } else if (req.body.bookingNumber > 150) {
    res.render('createBooking', {
      successMessage: '',
      failMessage: 'Please book for less than 150 People',
      req: req,
      booking: booking,
    });
    console.log('too many people');
  } else if (req.body.bookingDate < date1){
    res.render('createBooking', {
      successMessage: '',
      failMessage: 'Please input a valid date',
      req: req,
      booking: booking,
    });
  } else if (confirmBookingDate) {
    res.render('createBooking', {
      successMessage: '',
      failMessage: 'Booking already reserved for this date',
      req: req,
      booking: booking,
    });
    console.log('wrong date');
  } else {
    booking = await booking.save();
    console.log('booking saved to databases');
    res.render('createBooking', {
      successMessage: 'Booking successfully created',
      failMessage: '',
      req: req,
      booking: booking,
    });
  }
});

router.get('/removeBooking', (req, res) => {
  console.log('remove booking opened');
  res.render('removeBooking', { req: req });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
