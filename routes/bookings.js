const express = require('express');
const Booking = require('../models/booking');
const MenuItem = require('../models/menu_item');
const router = express.Router();
const crypto = require('crypto');
const { isUndefined } = require('util');
const { findById } = require('../models/booking');

router.get('/', checkAuthenticated, async (req, res) => {
  const booking = await Booking.find({ bookingUserEmail: req.user.email });
  res.render('booking', { failMessage: '', req: req, booking: booking });
});

router.get('/createBooking', checkAuthenticated, async (req, res) => {
  const menu = await MenuItem.find({});

  console.log('create booking opened');
  res.render('createBooking', {
    successMessage: '',
    failMessage: '',
    req: req,
    booking: new Booking(),
    menu: menu,
  });
});

router.get('/edit/:bookingID', checkAuthenticated, async (req, res) => {
  // Not yet finished
  const booking = await Booking.findOne({ bookingID: req.params.bookingID });
  const menu = await MenuItem.find({});
  res.render('editBooking', {
    req: req,
    successMessage: '',
    failMessage: '',
    booking: booking,
    menu: menu,
  });
});

router.post('/', checkAuthenticated, async (req, res) => {
  const newID = crypto.randomBytes(6).toString('hex');
  let remainCapacity = 150;
  let thisYear = new Date().getFullYear();
  let thisMonth = new Date().getMonth();
  let thisDay = new Date().getDay();
  let todayDate = new Date();
  let todayDate100 = new Date(thisYear + 100, thisMonth, thisDay);
  let todayDate1000 = new Date(thisYear + 1000, thisMonth, thisDay);
  let bookingDateFormatted = new Date(req.body.bookingDate);

  console.log(todayDate);
  console.log(req.body.bookingMealTime);

  let booking = new Booking({
    bookingID: newID,
    bookingDate: req.body.bookingDate,
    bookingNumber: req.body.bookingNumber,
    allergyDescription: req.body.allergyDescription,
    bookingUserEmail: req.user.email,
    bookingUserFirstName: req.user.firstName,
    bookingUserLastName: req.user.lastName,
    bookingMealTime: req.body.bookingMealTime,
    isActive: true,
  });

  let confirmBookingID = await Booking.findOne({
    bookingID: req.body.bookingID,
  });

  var bookingByDay = await Booking.find({
    bookingDate: req.body.bookingDate,
    isActive: true,
  });
  bookingByDay.forEach((bookingDay) => {
    if (bookingDay.bookingMealTime == req.body.bookingMealTime) {
      remainCapacity = remainCapacity - bookingDay.bookingNumber;
    }
  });

  remainCapacity = remainCapacity - req.body.bookingNumber;
  otherCapacity = req.body.bookingNumber - -remainCapacity;

  console.log(remainCapacity);

  const menu = await MenuItem.find({});

  if (confirmBookingID) {
    res.render('createBooking', {
      successMessage: '',
      failMessage: 'This booking already exists',
      req: req,
      booking: booking,
      menu: menu,
    });
    console.log('This booking already exists');
  } else if (checkForBookingsMade == true) {
    res.render('createBooking', {
      successMessage: '',
      failMessage: 'You already have a booking for this date and time!',
      req: req,
      booking: booking,
      menu: menu,
    });
  } else if (remainCapacity < 0) {
    res.render('createBooking', {
      successMessage: '',
      failMessage:
        'No spots available, please book for less than ' +
        otherCapacity +
        ' people',
      req: req,
      booking: booking,
      menu: menu,
    });
  } else if (bookingDateFormatted < todayDate) {
    res.render('createBooking', {
      successMessage: '',
      failMessage: 'Please book for a future date',
      req: req,
      booking: booking,
      menu: menu,
    });
  } else if (bookingDateFormatted > todayDate1000) {
    res.render('createBooking', {
      successMessage: '',
      failMessage: 'Come on, 1000 years, REALLY?!!',
      req: req,
      booking: booking,
      menu: menu,
    });
  } else if (bookingDateFormatted > todayDate100) {
    res.render('createBooking', {
      successMessage: '',
      failMessage: 'Check back with us at the end of the century',
      req: req,
      booking: booking,
      menu: menu,
    });
  } else if (req.body.bookingNumber < 0) {
    res.render('createBooking', {
      successMessage: '',
      failMessage: 'Please enter a valid number',
      req: req,
      booking: booking,
      menu: menu,
    });
    console.log('too many people');
  } else {
    try {
      booking = await booking.save();
      console.log('booking saved to databases');
      res.render('createBooking', {
        successMessage: 'Booking successfully created',
        failMessage: '',
        req: req,
        booking: booking,
        menu: menu,
      });
    } catch (e) {
      console.log(e);
      res.render('createBooking', {
        req: req,
        successMessage: '',
        failMessage: 'Please select a time',
        booking: booking,
        menu: menu,
      });
    }
  }
});

router.put('/:bookingID', checkAuthenticated, async (req, res) => {
  //NEED TO ADD CLAUSES IN
  const filter = { bookingID: req.params.bookingID };
  const update = {
    bookingDate: req.body.bookingDate,
    bookingNumber: req.body.bookingNumber,
    allergyDescription: req.body.allergyDescription,
    bookingUserEmail: req.user.email,
    bookingUserFirstName: req.user.firstName,
    bookingUserLastName: req.user.lastName,
    isActive: true,
    bookingMealTime: req.body.bookingMealTime,
  };
  console.log(update);
  const booking = await Booking.findOne({ bookingID: req.params.bookingID });
  
  const menu = await MenuItem.find({});
  
  let remainCapacity = 150;
  let thisYear = new Date().getFullYear();
  let thisMonth = new Date().getMonth();
  let thisDay = new Date().getDay();
  let todayDate = new Date();
  let todayDate100 = new Date(thisYear + 100, thisMonth, thisDay);
  let todayDate1000 = new Date(thisYear + 1000, thisMonth, thisDay);
  let bookingDateFormatted = new Date(req.body.bookingDate);

  console.log(todayDate);
  console.log(req.body.bookingMealTime);

  let confirmBookingID = await Booking.findOne({
    bookingID: req.body.bookingID,
  });

  var bookingByDay = await Booking.find({
    bookingDate: req.body.bookingDate,
    isActive: true,
  });
  bookingByDay.forEach((bookingDay) => {
    if (bookingDay.bookingMealTime == req.body.bookingMealTime) {
      remainCapacity = remainCapacity - bookingDay.bookingNumber;
    }
  });

  remainCapacity = remainCapacity - req.body.bookingNumber;
  otherCapacity = req.body.bookingNumber - -remainCapacity;

  console.log(remainCapacity);

  if (confirmBookingID) {
    res.render('editBooking', {
      successMessage: '',
      failMessage: 'This booking already exists',
      req: req,
      booking: booking,
      menu: menu,
    });
    console.log('This booking already exists');
  } else if (checkForBookingsMade == true) {
    res.render('editBooking', {
      successMessage: '',
      failMessage: 'You already have a booking for this date and time!',
      req: req,
      booking: booking,
      menu: menu,
    });
  } else if (remainCapacity < 0) {
    res.render('editBooking', {
      successMessage: '',
      failMessage:
        'No spots available, please book for less than ' +
        otherCapacity +
        ' people',
      req: req,
      booking: booking,
      menu: menu,
    });
  } else if (bookingDateFormatted < todayDate) {
    res.render('editBooking', {
      successMessage: '',
      failMessage: 'Please book for a future date',
      req: req,
      booking: booking,
      menu: menu,
    });
  } else if (bookingDateFormatted > todayDate1000) {
    res.render('editBooking', {
      successMessage: '',
      failMessage: 'Come on, 1000 years, REALLY?!!',
      req: req,
      booking: booking,
      menu: menu,
    });
  } else if (bookingDateFormatted > todayDate100) {
    res.render('editBooking', {
      successMessage: '',
      failMessage: 'Check back with us at the end of the century',
      req: req,
      booking: booking,
      menu: menu,
    });
  } else if (req.body.bookingNumber < 0) {
    res.render('editBooking', {
      successMessage: '',
      failMessage: 'Please enter a valid number',
      req: req,
      booking: booking,
      menu: menu,
    });
    console.log('too many people');
  } else if (!req.body.bookingMealTime) {
    res.render('editBooking', {
      req: req,
      successMessage: '',
      failMessage: 'Please select a time',
      booking: booking,
      menu: menu,
    });
  } else {
      await Booking.findOneAndUpdate(filter, update);
      res.redirect('/bookings');
  }

});

router.put('/edit/addItem/:bookingID', async (req, res) => {
  //updating an item from menu from edit booking
  //WORK IN PROGRESS
  let booking = await Booking.findOne({ bookingID: req.params.bookingID });
  let menuItem = {
    menuItemId: req.body.menuItemId,
    menuItemName: req.body.menuItemName,
    quantity: 1,
    price: req.body.price
  };
  let currentPrice
  booking.totalPrice ? currentPrice = booking.totalPrice : currentPrice = 0;
  const newPrice = parseInt(req.body.price)
  const totalPrice = currentPrice + newPrice
  booking.totalPrice = totalPrice;
  booking.menuItems.push(menuItem);
  await booking.save();
  res.redirect('back');
});

router.put('/edit/removeItem/:bookingID', async (req, res) => {
  const {menuItemId} = req.body
  const booking = await Booking.findOne({bookingID: req.params.bookingID})
  await booking.updateOne({ $pull: {menuItems: {_id: menuItemId} }})
  const itemPrice = parseInt(req.body.price)
  booking.totalPrice = booking.totalPrice - itemPrice
  await booking.save();
  res.redirect('back');
});

router.post('/:bookingID', checkAuthenticated, async (req, res) => {
  let thisBooking = await Booking.findOne({ bookingID: req.params.bookingID });
  let thisBookingDate = thisBooking.bookingDate;
  let thisBookingDateFormatted = new Date(thisBookingDate);
  let thisBookingYear = thisBookingDateFormatted.getFullYear();
  let thisBookingMonth = thisBookingDateFormatted.getMonth();
  let thisBookingDay = thisBookingDateFormatted.getDay();
  let yesterDate = new Date(
    thisBookingYear,
    thisBookingMonth,
    thisBookingDay - 1
  );
  let todayDate = new Date();
  const booking = await Booking.find({ bookingUserEmail: req.user.email });
  if (todayDate > yesterDate) {
    res.redirect('/bookings');
    // res.render('booking', { failMessage: 'Must cancel Bookings at least a day before commencement', req: req, booking: booking });
    console.log('too close');
  } else {
    const cancelBooking = req.params.bookingID;
    console.log('Booking ' + cancelBooking + ' has been cancelled');
    const filter = { bookingID: cancelBooking };
    const update = { isActive: false };
    await Booking.findOneAndUpdate(filter, update);
    res.redirect('/bookings');
  }
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}
async function checkForBookingsMade(req) {
  let CFBM = await Booking.findOne({
    bookingUserEmail: req.body.bookingUserEmail,
    bookingDate: req.body.bookingDate,
    bookingMealTime: req.body.bookingMealTime,
  });
  try {
    if (CFBM.bookingUserEmail === undefined) {
      console.log(CFBM.bookingUserEmail);
      return false;
    } else {
      console.log(CFBM.bookingUserEmail);
      return true;
    }
  } catch (e) {
    return false;
  }
}

module.exports = router;
