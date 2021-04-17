const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  console.log('System Message page opened');
  res.render('message', { req: req, messageResult: ' ' });
});

module.exports = router;
