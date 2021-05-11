const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const discountSchema = new Schema({
  codeValue: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Discount Code', discountSchema);
