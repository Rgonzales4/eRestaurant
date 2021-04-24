const express = require('express');
const Booking = require('../models/booking');
const router = express.Router();
const crypto = require('crypto');

router.get('/', checkAuthenticated, async (req, res) => {
  const booking = await Booking.find({ bookingUserEmail: req.user.email });
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
  const newID = crypto.randomBytes(6).toString('hex');
  let remainCapacity = 150;
  console.log(newID);
  let booking = new Booking({
    bookingID: newID,
    bookingDate: req.body.bookingDate,
    bookingNumber: req.body.bookingNumber,
    allergyDescription: req.body.allergyDescription,
    bookingUserEmail: req.user.email,
    bookingUserFirstName: req.user.firstName,
    bookingUserLastName: req.user.lastName,
    bookingMealTime: req.body.bookingMealTime,
    isActive: true,
  });
  console.log(req.body.bookingMealTime)

  let confirmBookingID = await Booking.findOne({
    bookingID: req.body.bookingID,
  });

  let confirmBookingDate = await Booking.findOne({
    // Need to account for time of the reservation
    bookingDate: req.body.bookingDate,
  });

  let confirmBookingDateNumber = await Booking.find({
    bookingDate: req.body.bookingDate,
  });

  var bookingByDay = await Booking.find({
    bookingDate: req.body.bookingDate,
    isActive: true,
  });
  bookingByDay.forEach(bookingDay =>{
  if (bookingDay.bookingMealTime == req.body.bookingMealTime){
    remainCapacity = remainCapacity - bookingDay.bookingNumber
  }
  })
  
  remainCapacity = remainCapacity - req.body.bookingNumber; 
  otherCapacity = req.body.bookingNumber - -remainCapacity;
  
  console.log(remainCapacity)

  if (confirmBookingID) {
    res.render('createBooking', {
      successMessage: '',
      failMessage: 'This booking already exists',
      req: req,
      booking: booking,
    });
    console.log('This booking already exists');
  } else if (remainCapacity < 0) {
    res.render('createBooking', {
      successMessage: '',
      failMessage: 'No spots available, please book for less than ' + otherCapacity + ' people',
      req: req,
      booking: booking,
    });
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

router.post('/:bookingID', checkAuthenticated, async (req, res) => {
  const cancelBooking = req.params.bookingID;
  console.log('Booking ' + cancelBooking + ' has been cancelled');
  const filter = { bookingID: cancelBooking };
  const update = { isActive: false };
  await Booking.findOneAndUpdate(filter, update);
  const booking = await Booking.find({ bookingUserEmail: req.user.email });
  res.render('booking', { req: req, booking: booking });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}


module.exports = router;
