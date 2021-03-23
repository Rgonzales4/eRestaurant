const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  console.log('About Us page opened');
  res.render('about');
});

module.exports = router;
