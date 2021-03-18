const { text } = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: text,
    required: true,
  },
  firstName: {
    type: text,
    required: true,
  },
  lastName: {
    type: text,
    required: true,
  },
  password: {
    type: text,
    required: true,
  },
});

module.export = mongoose.model('Users', UserSchema);
