const express = require('express');
const Booking = require('./../models/booking');
const router = express.Router();

router.get('/', (req, res) => {
  console.log('Booking page opened');
  res.render('booking', { req: req });
});

router.get('/createBooking', (req, res) => {
  console.log('create booking opened');
  res.render('createBooking', { article: new Article() });
})

router.post('/booking', async (req, res) => {
  const booking = new Booking({
    bookingID = req.body.bookingID,
    bookingDate = req.body.bookingDate,
    bookingNumber = req.body.bookingNumber,
    allergyDescription = req.body.allergyDescription
  })
try{
  await booking.save()
}
catch(e) {
  res.render('booking/createBooking', { booking : booking })
}
})

router.get('/removeBooking', (req, res) => {
  console.log('remove booking opened');
  res.render('removeBooking', {req : req});
})

module.exports = router;

