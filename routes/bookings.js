const express = require('express');
const Booking = require('../models/booking');
const router = express.Router();
const crypto = require('crypto');

router.get('/', checkAuthenticated, async (req, res) => {
  const booking = await Booking.find({ bookingUserEmail: req.user.email });
  res.render('booking', { failMessage: '', req: req, booking: booking });
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
  let thisYear = new Date().getFullYear();
  let thisMonth = new Date().getMonth();
  let thisDay = new Date().getDay();
  let todayDate = new Date();
  let todayDate100 = new Date(thisYear + 100, thisMonth, thisDay)
  let todayDate1000 = new Date(thisYear + 1000, thisMonth, thisDay)
  let bookingDateFormatted = new Date(req.body.bookingDate)

  console.log(todayDate);
  console.log(req.body.bookingMealTime)

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

  let userBookings = await Booking.find({
    bookingUserEmail: req.user.email
  })

  let confirmBookingID = await Booking.findOne({
    bookingID: req.body.bookingID,
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
  } else if (bookingDateFormatted < todayDate) {
    res.render('createBooking', {
      successMessage: '',
      failMessage: 'Please book for a future date',
      req: req,
      booking: booking,
    });
  } else if (bookingDateFormatted > todayDate1000) {
      res.render('createBooking', {
        successMessage: '',
        failMessage: 'Come on, 1000 years, REALLY?!!',
        req: req,
        booking: booking,
    });
  } else if (bookingDateFormatted > todayDate100) {
    res.render('createBooking', {
      successMessage: '',
      failMessage: 'Check back with us at the end of the century',
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
    try {
      booking = await booking.save();
      console.log('booking saved to databases');
      res.render('createBooking', {
        successMessage: 'Booking successfully created',
        failMessage: '',
        req: req,
        booking: booking,
    })}
    catch (e) {
      console.log(e);
      res.render('createBooking', {
        req: req,
        successMessage: '',
        failMessage: 'Please select a time',
        booking: booking,
      });
    }
}});

router.post('/:bookingID', checkAuthenticated, async (req, res) => {
  let thisBooking = await Booking.findOne({bookingID: req.params.bookingID})
  let thisBookingDate = thisBooking.bookingDate
  let thisBookingDateFormatted = new Date(thisBookingDate)
  let thisBookingYear = thisBookingDateFormatted.getFullYear();
  let thisBookingMonth = thisBookingDateFormatted.getMonth();
  let thisBookingDay = thisBookingDateFormatted.getDay();
  let yesterDate = new Date(thisBookingYear, thisBookingMonth, thisBookingDay - 1);
  let todayDate = new Date();
  const booking = await Booking.find({ bookingUserEmail: req.user.email });
  if (todayDate > yesterDate){
    res.redirect('/bookings')
    // res.render('booking', { failMessage: 'Must cancel Bookings at least a day before commencement', req: req, booking: booking });
    console.log('too close');
  } else {
  const cancelBooking = req.params.bookingID;
  console.log('Booking ' + cancelBooking + ' has been cancelled');
  const filter = { bookingID: cancelBooking };
  const update = { isActive: false };
  await Booking.findOneAndUpdate(filter, update);
  res.redirect('/bookings');
}});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}


module.exports = router;
