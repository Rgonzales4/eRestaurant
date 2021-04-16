const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const MenuItem = require('../models/menu_item');

router.get('/', async (req, res) => {
  console.log('Menu page opened');
  const menuItem = await MenuItem.find({}); 
  res.render('menu', { req: req, menu_item: menuItem });
});

module.exports = router;
