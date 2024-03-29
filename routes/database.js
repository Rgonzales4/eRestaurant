const express = require('express');
const router = express.Router();

const User = require('../models/users');
const Booking = require('../models/booking');
const MenuItem = require('../models/menu_item');
const discountCode = require('../models/discount_code');

const menuRouter = require('./menu');
const bookingRouter = require('./bookings');
router.use('/menu', menuRouter);
router.use('/bookings', bookingRouter);

router.get('/', checkAdmin, async (req, res) => {
  console.log('Database page opened');
  let Users = await User.find().sort({ firstName: 'asc' });
  let Bookings = await Booking.find().sort({ bookingDate: 'asc' });
  let MenuItems = await MenuItem.find().sort({ itemName: 'asc' });
  res.render('database', {
    req: req,
    Users: Users,
    Bookings: Bookings,
    MenuItems: MenuItems,
  });
});

//VIEW USER PROFILE
router.get('/account/:userId', checkAdmin, async (req, res) => {
  const userAccount = await User.findOne({ userId: req.params.userId });
  console.log(`View profile page: ${req.params}`);
  console.log(
    `Database accessing user profile: ${userAccount.firstName} ${userAccount.lastName}`
  );
  res.render('profile', {
    req: req,
    user: userAccount,
    adminEdit: true,
    userID: req.params.userId,
  });
});

//VIEWING THE EDIT PAGE FOR THE USER
router.get('/account/:userId/editProfile', checkAdmin, async (req, res) => {
  const userAccount = await User.findOne({ userId: req.params.userId });
  console.log(`Edit profile page: ${req.params}`);
  console.log(
    `Edit User ${userAccount.userId} ${userAccount.firstName} ${userAccount.lastName} page open`
  );
  res.render('editProfile', { req: req, user: userAccount, adminEdit: true });
});

//UPDATING USER PROFILE
router.post('/account/:userId/editProfile', checkAdmin, async (req, res) => {
  const filter = { userId: req.params.userId };
  const update = { firstName: req.body.firstName, lastName: req.body.lastName };
  console.log(update);
  await User.findOneAndUpdate(filter, update);
  res.redirect('/database');
});

//VIEW BOOKING DETAILS
router.get('/booking/:bookingID', checkAdmin, async (req, res) => {
  const bookingDetails = await Booking.findOne({
    bookingID: req.params.bookingID,
  });
  console.log(
    `Accessing booking details: ${bookingDetails.bookingID} under ${bookingDetails.bookingUserFirstName} ${bookingDetails.bookingUserLastName}`
  );
  res.render('viewBooking', { req: req, booking: bookingDetails });
});

//TOGGLE BOOKING
router.post('/booking/:bookingID/update', checkAdmin, async (req, res) => {
  const updateBooking = req.params.bookingID;
  console.log('Booking ' + updateBooking + ' has been updated');
  const filter = { bookingID: updateBooking };
  const update = { isActive: false };
  await Booking.findOneAndUpdate(filter, update);
  res.redirect('/database');
});

//DELETE BOOKING
router.delete('/booking/:bookingID', checkAdmin, async (req, res) => {
  console.log('Booking Deletion output Statement');
  const deleteBooking = await Booking.findOne({
    bookingID: req.params.bookingID,
  });
  console.log(deleteBooking);
  await Booking.findByIdAndDelete(deleteBooking.id);
  console.log(`Booking ${deleteBooking.bookingID} deleted`);
  res.redirect('/database');
});

//DELETE USER
router.delete('/:userId', checkAdmin, async (req, res) => {
  console.log('User Deletion output Statement');
  const userAccount = await User.findOne({ userId: req.params.userId });
  console.log(userAccount);
  Booking.deleteMany(
    { bookingUserEmail: userAccount.email },
    console.log(),
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
    }
  );
  await User.findByIdAndDelete(userAccount.id);
  const Users = await User.find().sort({ firstName: 'asc' });
  const Bookings = await Booking.find().sort({ bookingDate: 'asc' });
  const MenuItems = await MenuItem.find().sort({ itemName: 'asc' });
  res.render('database', {
    req: req,
    Users: Users,
    Bookings: Bookings,
    MenuItems: MenuItems,
  });
});

//CREATE A DISCOUNT CODE
router.post('/createDiscountCode', checkAdmin, async (req, res) => {
  const codes = await discountCode.find({});
  for (let i = 0; i < codes.length; i++) {
    if (codes[i].codeValue == req.body.codeValue) {
      console.log('Discount Code already exists');
      res.redirect('/database');
      return;
    }
  }
  const newCode = new discountCode({
    codeValue: req.body.codeValue,
  });
  console.log(`New code added: ${newCode.codeValue}`);
  newCode.save();
  res.redirect('/database');
});

function checkAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin === true) {
    return next();
  }
  res.redirect('/');
}

module.exports = router;
