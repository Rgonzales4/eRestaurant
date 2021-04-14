const express = require('express');
const Booking = require('../models/booking');
const router = express.Router();
const mongoose = require('mongoose');
const { db } = require('../models/booking');
const crypto = require('crypto')

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

router.get('/edit/:bookingID', async (req, res) => {
  const booking = await Booking.findOne({ bookingID: req.params.bookingID });
  res.render('edit', {
    req: req,
    successMessage: '',
    failMessage: '',
    booking: booking,
  });
});

router.post('/', async (req, res) => {
  const newID = crypto.randomBytes(6).toString("hex")

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
  let confirmBookingDateNumber = await Booking.find({
    time: req.body.bookingDate
  })
  console.log(confirmBookingDateNumber.forEach(
    b =>{
    i = b.bookingNumber,
    j = b.bookingNumber + i
    return j}
    ))
    
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
   } else if (req.body.bookingNumber < 0) {
      res.render('createBooking', {
        successMessage: '',
        failMessage: 'Please enter a valid number',
        req: req,
        booking: booking,
      });
      console.log('too many people');
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

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

router.put('/:id', (req, res) => {});

router.delete('/:bookingID', async (req, res) => {
  const deleteBookingID = req.params.bookingID;
  await Booking.findOneAndDelete(deleteBookingID);
  res.redirect('/bookings');
  console.log('Booking ' + deleteBookingID + ' has been deleted');
});

module.exports = router;
