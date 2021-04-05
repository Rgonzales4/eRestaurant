const express = require('express');
const Booking = require('../models/booking');
const User = require('../models/users')
const router = express.Router();

router.get('/', checkAuthenticated, async (req, res) => {
  console.log('Booking page opened');
  const booking = await Booking.find({bookingUser: req.user.email}).sort({bookingID : 'asc'});
  res.render('booking', {req : req, booking : booking});
});

router.get('/createBooking', checkAuthenticated, (req, res) => {
  console.log('create booking opened');
  res.render('createBooking', { successMessage: '', failMessage: '',
  req : req, booking : new Booking() });
})

router.post('/', async (req, res) =>{

let booking = new Booking({
  bookingID: req.body.bookingID,
  time: req.body.bookingDate,
  bookingNumber: req.body.bookingNumber,
  allergyDescription: req.body.allergyDescription,
  bookingUser: req.user.email,
})

let confirmBooking = await Booking.findOne({bookingID: req.body.bookingID})
if(confirmBooking){
  res.render('createBooking', {successMessage: '', failMessage: 'This booking already exists',
  req: req, booking : booking})
  console.log("This booking already exists")
}
else{
  booking = await booking.save()
  console.log("booking saved to databases")
  res.render('createBooking', {successMessage: 'Booking successfully created', failMessage: '',
  req: req, booking : booking} )
}})




router.get('/removeBooking', (req, res) => {
  console.log('remove booking opened');
  res.render('removeBooking', {req : req});
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}


module.exports = router;

