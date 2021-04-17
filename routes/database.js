const express = require('express');
const router = express.Router();

const User = require('../models/users');
const Booking = require('../models/booking');
const { Model, Mongoose } = require('mongoose');

router.get('/', checkAdmin, async (req, res) => {
  console.log('Database page opened');
  let Users = await User.find().sort({ firstName: 'asc' });
  let Bookings = await Booking.find().sort({ bookingDate: 'asc' });
  //console.log(Bookings);
  res.render('database', { req: req, Users: Users, Bookings: Bookings });
});

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

router.get('/account/:userId/editProfile', checkAdmin, async (req, res) => {
  const userAccount = await User.findOne({ userId: req.params.userId });
  console.log(`Edit profile page: ${req.params}`);
  console.log(
    `Edit User ${userAccount.userId} ${userAccount.firstName} ${userAccount.lastName} page open`
  );
  res.render('editProfile', { req: req, user: userAccount, adminEdit: true });
});

//UPDATING USER PROFILE FUNCTION
router.post('/account/:userId/editProfile', checkAdmin, async (req, res) => {
  const filter = { userId: req.params.userId };
  const update = { firstName: req.body.firstName, lastName: req.body.lastName };
  console.log(update);
  await User.findOneAndUpdate(filter, update);
  res.redirect('/database');
});

router.get('/booking/:bookingID', checkAdmin, async (req, res) => {
  const bookingDetails = await Booking.findOne({
    bookingID: req.params.bookingID,
  });
  console.log(
    `Accessing booking details: ${bookingDetails.bookingID} under ${bookingDetails.bookingUserFirstName} ${bookingDetails.bookingUserLastName}`
  );
  res.render('viewBooking', { req: req, booking: bookingDetails });
});

router.delete('/:userId', checkAdmin, async (req, res) => {
  console.log('User Deletion output Statement');
  const userAccount = await User.findOne({ userId: req.params.userId });
  Booking.deleteMany(
    { bookingUser: userAccount.bookingUserEmail },
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
  res.render('database', { req: req, Users: Users, Bookings: Bookings });
});

// router.delete('/:bookingID', checkAdmin, async (req, res) => {
//   console.log(`Booking ${req.params.bookingID} deleted`);
//   await Booking.findOneAndDelete(req.params.bookingID);
//   const Users = await User.find().sort({ firstName: 'asc' });
//   const Bookings = await Booking.find().sort({ bookingDate: 'asc' });
//   res.render('database', { req: req, Users: Users, Bookings: Bookings });
// });

function checkAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin === true) {
    return next();
  }
  res.redirect('/');
}

module.exports = router;
