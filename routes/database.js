const express = require('express');
const router = express.Router();

const User = require('../models/users');
const Booking = require('../models/booking');
const { Model, Mongoose } = require('mongoose');

router.get('/', checkAdmin, async (req, res) => {
  console.log('Database page opened');
  const Users = await User.find().sort({ firstName: 'asc' });
  const Bookings = await Booking.find().sort({ bookingID: 'asc' });
  res.render('database', { req: req, Users: Users, Bookings: Bookings });
});

router.get('/account/:userId', checkAdmin, async (req, res) => {
  const userAccount = await User.findOne({ userId: req.params.userId });
  console.log(
    `Accessing user profile: ${userAccount.firstName} ${userAccount.lastName}`
  );
  res.render('profile', { req: req, user: userAccount });
});

//NOT YET FINISHED - ITS DELETING THE WRONG USER
router.delete('/:userId', checkAdmin, async (req, res) => {
  // const userBookings = await Booking.find({ bookingUser: userAccount.email });

  // const bookingsDeleted = true;
  // while (bookingsDeleted) {
  //   console.log('Deletion in Progress');
  //   const bookingToDelete = Booking.findOne({ bookingUser: userAccount.email });
  //   console.log(bookingToDelete);
  //   if (bookingToDelete.bookingUser == userAccount.email) {
  //     await Booking.findOneAndDelete(bookingToDelete);
  //   } else {
  //     bookingsDeleted = false;
  //   }
  // }
  // console.log(userAccount);
  // const Users = await User.find().sort({ firstName: 'asc' });
  // const Bookings = await Booking.find().sort({ bookingID: 'asc' });
  // res.render('database', { req: req, Users: Users, Bookings: Bookings });

  console.log('Deletion output Statement');
  const userAccount = await User.findOne({ userId: req.params.userId });
  Booking.deleteMany(
    { bookingUser: userAccount.email },
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
  const Bookings = await Booking.find().sort({ bookingID: 'asc' });
  res.render('database', { req: req, Users: Users, Bookings: Bookings });
});

function checkAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin === true) {
    return next();
  }
  res.redirect('/');
}

module.exports = router;
