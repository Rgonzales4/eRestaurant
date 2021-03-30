const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  console.log('Menu page opened');
  res.render('menu');
});

module.exports = router;