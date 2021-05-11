const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const discountSchema = new Schema({
  code: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('discountCode', discountSchema);
