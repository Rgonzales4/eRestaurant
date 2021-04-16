const mongoose = require('mongoose');
const users = require('./users');
const Schema = mongoose.Schema;

const MenuSchema = new Schema({
    itemID: {
        type: String,
        required: true,
    },
    itemName: {
        type: String,
        required: true,
    },
    itemDescription:{
        type: String,
        required: true,
    },
    itemIngredients:{
        type: String,
        required: true,
    },
});


module.exports = mongoose.model('Menu', MenuSchema);