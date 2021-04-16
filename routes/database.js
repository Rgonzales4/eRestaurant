const express = require('express');
const router = express.Router();

const User = require('../models/users');
const Booking = require('../models/booking');
const MenuItem = require('../models/menu_item');

router.get('/', checkAdmin, async (req, res) => {
  console.log('Databasee page opened');
  const Users = await User.find().sort({ firstName: 'asc' });
  const Bookings = await Booking.find().sort({ bookingID: 'asc' });
  const MenuItems = await MenuItem.find().sort({ itemID: 'asc' });
  res.render('database', { req: req, Users: Users, Bookings: Bookings, MenuItems: MenuItems });
});

function checkAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin === true) {
    return next();
  }
  res.redirect('/');
}

module.exports = router;
