const express = require('express');
const Booking = require('../models/booking');
const User = require('../models/users')
const router = express.Router();

router.get('/', (req, res) => {
  console.log('Booking page opened');
  res.render('booking', { req: req, booking : new Booking()});
});

router.get('/createBooking', (req, res) => {
  console.log('create booking opened');
  res.render('createBooking', { req : req, booking : new Booking() });
})

router.post('/', async (req, res) => {
  let booking = new Booking({
    bookingID: req.body.bookingID,
    time: req.body.bookingDate,
    bookingNumber: req.body.bookingNumber,
    allergyDescription: req.body.allergyDescription,
  })
let confirmBooking = await Booking.findOne({bookingID: req.body.bookingID})
if(confirmBooking){
  res.render('createBooking', {req: req, booking : booking})
  console.log("This booking already exists")
}
else{
  booking = await booking.save()
  console.log("booking saved to databases")
  res.render('createBooking', {req: req, booking : booking} )
}})

router.get('/removeBooking', (req, res) => {
  console.log('remove booking opened');
  res.render('removeBooking', {req : req});
})


module.exports = router;

