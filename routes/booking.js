const express = require('express');
const Booking = require('./../models/booking');
const router = express.Router();

router.get('/', (req, res) => {
  console.log('Booking page opened');
  res.render('booking', { req: req });
});

router.get('/createBooking', (req, res) => {
  console.log('create booking opened');
  res.render('booking/createBooking', {req : req});
})

router.get('/removeBooking', (req, res) => {
  console.log('remove booking opened');
  res.render('booking/removeBooking', {req : req});
})

module.exports = router;

