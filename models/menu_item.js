const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MenuSchema = new Schema({
  itemID: {
    type: String,
    required: true,
  },

  // Food = True, Drinks = False
  isItFood: {
    type: String,
    required: true,
  },

  itemName: {
    type: String,
    required: true,
  },

  itemPrice: {
    type: Number,
    required: true,
  },

  itemDescription: {
    type: String,
    required: true,
  },

  itemIngredients: {
    type: String,
    required: true,
  },

  // Menu Time Category --> All Boolean, used for filtering
  mealType: {
    type: String,
    required: true,
  },

  // Dietary Requirements:
  veganScum: {
    type: Boolean,
    default: 'false',
    required: true,
  },

  glutenFree: {
    type: Boolean,
    default: 'false',
    required: true,
  },

  nutFree: {
    type: Boolean,
    default: 'false',
    required: true,
  },

  vegetarian: {
    type: Boolean,
    default: 'false',
    required: true,
  },

  dairyFree: {
    type: Boolean,
    default: 'false',
    required: true,
  },
});

module.exports = mongoose.model('Menu', MenuSchema);
