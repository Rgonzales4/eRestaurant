const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  console.log('Booking page opened');
  res.render('booking', { req: req });
});

module.exports = router;

