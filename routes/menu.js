const express = require('express');
const router = express.Router();
const MenuItem = require('../models/menu_item');

router.get('/', async (req, res) => {
  console.log('Menu page opened');
  const menuItem = await MenuItem.find({});
  res.render('menu', { req: req, menu_item: menuItem });
});

router.get('/view/:itemID', async (req, res) => {
  const menuItem = await MenuItem.findOne({ itemID: req.params.itemID });
  res.render('viewMenuItem', { req: req, menu_item: menuItem });
});

router.get('/createMenuItem', async (req, res) => {
  console.log('Create Menu Item page');
  res.render('createMenuItem', { req: req });
});

module.exports = router;
