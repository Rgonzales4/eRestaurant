require('dotenv/config');
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const multer = require('multer');

const MenuItem = require('../models/menu_item');
var breakfastGroup;
var lunchDinnerGroup;
var drinkGroup;

router.use(express.static('uploads'));

// Multer setup for storing uploaded files (images for menu items)
const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './views/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: Storage }).single('image');

//MENU FILTER
router.get('/', async (req, res) => {
  console.log('Menu page opened');
  const menuItem = await MenuItem.find({});
  res.render('menu', { req: req, menu_item: menuItem });
});

router.post('/searchFilter', async (req, res) => {
  // var vegetarianItem;
  // var veganItem;

  var breakfastGroup = await MenuItem.find({ nutFree: true });
  var lunchDinnerGroup = await MenuItem.find({ nutFree: true });
  var drinkGroup = await MenuItem.find({ nutFree: true });

  var menuItem;

  //vegetarian food
  if (req.body.vegetarian) {
    if (menuItem == null) {
      menuItem = await MenuItem.find({ vegetarian: true });
    } else {
      var vegetarianItem = await MenuItem.find({ vegetarian: true });
      menuItem = menuItem.concat(vegetarianItem);
    }
  }

  //vegan food
  if (req.body.vegan) {
    if (menuItem == null) {
      menuItem = await MenuItem.find({ veganScum: true });
    } else {
      var veganItem = await MenuItem.find({ veganScum: true });
      menuItem = menuItem.concat(veganItem);
    }
  }

  //gluten-free
  if (req.body.glutenFree) {
    if (menuItem == null) {
      menuItem = await MenuItem.find({ glutenFree: true });
    } else {
      var glutenFreeItem = await MenuItem.find({ glutenFree: true });
      menuItem = menuItem.concat(glutenFreeItem);
    }
  }

  //Dairy Free
  if (req.body.dairyFree) {
    if (menuItem == null) {
      menuItem = await MenuItem.find({ dairyFree: true });
    } else {
      var dairyFreeItem = await MenuItem.find({ dairyFree: true });
      menuItem = menuItem.concat(dairyFreeItem);
    }
  }

  //Dairy Free
  if (req.body.nutFree) {
    if (menuItem == null) {
      menuItem = await MenuItem.find({ nutFree: true });
    } else {
      var nutFreeItem = await MenuItem.find({ nutFree: true });
      menuItem = menuItem.concat(nutFreeItem);
    }
  }

  //if(req.body.nutFree == null && req.body.dairyFree == null && req.body.glutenFree == null && req.body.vegan == null && req.body.vegetarian){
  //console.log('clear them filters bby');
  //menuItem = await MenuItem.find({});
  //}

  if (menuItem != null) {
    res.render('menu', { req: req, menu_item: menuItem });
  } else {
    const menuItem = await MenuItem.find({});
    res.render('menu', { req: req, menu_item: menuItem });
  }
});

//OPENING THE CREATE PAGE FOR MENU ITEM
router.get('/createMenuItem', checkAdmin, async (req, res) => {
  console.log('Create Menu Item page');
  res.render('createMenuItem', {
    req: req,
    errorMessage: '',
    menuItem: new MenuItem(),
  });
});

//OPENING THE EDIT PAGE FOR MENU ITEM
router.get('/editMenuItem/:itemID', checkAdmin, async (req, res) => {
  console.log('Edit Menu Item page');
  const currentItem = await MenuItem.findOne({ itemID: req.params.itemID });
  console.log(currentItem);
  res.render('editMenuItem', {
    req: req,
    errorMessage: '',
    menuItem: currentItem,
  });
});

//CREATE MENU ITEMS
router.post('/createMenuItem', checkAdmin, upload, async (req, res) => {
  console.log(' ');
  console.log('Menu Item being created:');

  //Create Image object is an image has been uploaded
  var newImage;
  var newMenuItem;
  if (req.file) {
    newImage = req.file.originalname;
  }

  newMenuItem = new MenuItem({
    itemID: crypto.randomBytes(6).toString('hex'),
    isItFood: req.body.isItFood,
    itemName: req.body.itemName,
    itemPrice: req.body.itemPrice,
    itemDescription: req.body.itemDescription,
    itemIngredients: req.body.itemIngredients,
    mealType: req.body.mealType,
    veganScum: req.body.veganScum,
    glutenFree: req.body.glutenFree,
    nutFree: req.body.nutFree,
    vegetarian: req.body.vegetarian,
    dairyFree: req.body.dairyFree,
    itemImg: newImage,
  });

  try {
    await newMenuItem.save();
    res.redirect('/menu');
  } catch (e) {
    console.log(e);
    res.render('createMenuItem', {
      req: req,
      errorMessage: 'Please make sure you filled in all the necessary sections',
      menuItem: newMenuItem,
    });
  }
});

//EDIT MENU ITEMS
router.post('/editMenuItem/:itemID', checkAdmin, upload, async (req, res) => {
  //Create Image object is an image has been uploaded
  var newImage;
  console.log('Output for req.file: ');
  console.log(req.file);
  if (!req.file) {
    console.log('No new Menu item image was uploaded');
    var currentMenuItem = await MenuItem.findOne({
      itemID: req.params.itemID,
    });
    newImage = currentMenuItem.itemImg;
  } else {
    newImage = req.file.originalname;
  }

  const filter = { itemID: req.params.itemID };
  const update = {
    isItFood: req.body.isItFood,
    itemName: req.body.itemName,
    itemPrice: req.body.itemPrice,
    itemDescription: req.body.itemDescription,
    itemIngredients: req.body.itemIngredients,
    mealType: req.body.mealType,
    veganScum: req.body.veganScum,
    glutenFree: req.body.glutenFree,
    nutFree: req.body.nutFree,
    vegetarian: req.body.vegetarian,
    dairyFree: req.body.dairyFree,
    itemImg: newImage,
  };
  console.log(update);
  await MenuItem.findOneAndUpdate(filter, update);
  res.redirect('/menu');
});

//VIEW MENU ITEM
router.get('/:itemID', async (req, res) => {
  console.log('\n', 'Viewing Menu item');
  var currentMenuItem = await MenuItem.findOne({
    itemID: req.params.itemID,
  });
  console.log('Menu Item', currentMenuItem.itemName, 'is being viewed');
  console.log(`${currentMenuItem.itemName} data:`, currentMenuItem);
  res.render('viewMenuItem', {
    req: req,
    menuItem: currentMenuItem,
  });
});

//DELETE MENU ITEM
router.delete('/:itemID', checkAdmin, async (req, res) => {
  console.log('Menu Item deletion output statement');
  const deletingMenuItem = await MenuItem.findOne({
    itemID: req.params.itemID,
  });
  console.log(`Menu Item ${deletingMenuItem.itemName} deleted`);
  await MenuItem.findByIdAndDelete(deletingMenuItem.id);
  res.redirect('/menu');
});

function checkAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin === true) {
    return next();
  }
  res.redirect('/');
}

module.exports = router;
