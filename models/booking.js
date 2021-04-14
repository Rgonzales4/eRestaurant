const mongoose = require('mongoose');
const users = require('./users');
const Schema = mongoose.Schema;
const crypto = require('crypto')

const BookingSchema = new Schema({
  bookingID: {
    type: String,
    required: true,
  },
  bookingUser: {
    type: String,
    default: null,
  },
  bookingNumber: {
    type: Number,
    required: true,
  },
  time:{
    type: Date,
    required: true,
  },
  allergyDescription: {
    type: String,
    default: "N/A",
  }
});


module.exports = mongoose.model('Booking', BookingSchema);