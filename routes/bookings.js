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

router.get('/edit/:bookingID', checkAuthenticated, async (req, res) => {
  // Not yet finished
  const booking = await Booking.findOne({ bookingID: req.params.bookingID });
  res.render('editBooking', {
    req: req,
    successMessage: '',
    failMessage: '',
    booking: booking,
  });
});

router.post('/', checkAuthenticated, async (req, res) => {
  const newID = (await Booking.count({})) + 1; // Need to change the value of the ID
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
    // Need to account for time of the reservation
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
    // Need to keep a counter for the whole day
    res.render('createBooking', {
      successMessage: '',
      failMessage: 'Please book for less than 150 People',
      req: req,
      booking: booking,
    });
    console.log('too many people');
  } else if (confirmBookingDate) {
    // Not finalised yet -- need to include a time slot
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

router.put('/:id', (req, res) => {});

router.delete('/:bookingID', async (req, res) => {
  const deleteBookingID = req.params.bookingID;
  console.log('Booking ' + deleteBookingID + ' has been deleted');
  await Booking.findOneAndDelete(deleteBookingID);
  res.redirect('/bookings');
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
