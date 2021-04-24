const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MenuSchema = new Schema({
  itemID: {
    type: String,
    required: true,
  },

  // Food = True, Drinks = False
  isItFood: {
    type: Boolean,
    requred: true,
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
    required: true,
  },

  glutenFree: {
    type: Boolean,
    required: true,
  },

  nutFree: {
    type: Boolean,
    required: true,
  },

  vegetarian: {
    type: Boolean,
    required: true,
  },

  dairyFree: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model('Menu', MenuSchema);
