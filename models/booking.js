const mongoose = require('mongoose');
const users = require('./users');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
  BookingID: {
    type: Number,
    required: true,
  },
  BookingUser: {
    type: User.email,
    required: true,
    default: null,
  },
  Time:{
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Booking', BookingSchema);