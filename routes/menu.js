require('dotenv/config');
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const multer = require('multer');
const fs = require('fs');

const MenuItem = require('../models/menu_item');
const ItemImage = require('../models/item_image');

// Multer setup for storing uploaded files (images for menu items)
const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    //Returns the extension of the file
    var ext = file.originalname.substr(file.originalname.lastIndexOf('.'));
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: Storage }).single('image');

router.get('/', async (req, res) => {
  console.log('Menu page opened');
  const menuItem = await MenuItem.find({});
  res.render('menu', { req: req, menu_item: menuItem });
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
    let img = {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      imageBase64: fs.readFileSync(req.file.path),
    };

    newImage = new ItemImage(img, (err) => {
      if (err) {
        console.log(err);
        res.render('createMenuItem', {
          req: req,
          errorMessage: 'Problem with creating the image of the menu item',
        });
      }
    });

    await newImage.save();
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
    });
  }
});

//EDIT MENU ITEMS
router.post('/editMenuItem/:itemID', checkAdmin, async (req, res) => {
  //Create Image object is an image has been uploaded
  var newImage;
  if (req.file) {
    let img = {
      // imageID: crypto.randomBytes(6).toString('hex'),
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      imageBase64: fs.readFileSync(req.file.path),
    };

    newImage = new ItemImage(img, (err) => {
      if (err) {
        console.log(err);
        res.render('createMenuItem', {
          req: req,
          errorMessage: 'Problem with creating the image of the menu item',
        });
      }
    });

    await newImage.save();
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

//DELETE MENU ITEM
router.delete('/:itemID', checkAdmin, async (req, res) => {
  console.log('Menu Item deletion output statement');
  const deletingMenuItem = await MenuItem.findOne({
    itemID: req.params.itemID,
  });
  console.log(`Menu Item ${deletingMenuItem.itemName} deleted`);
  await ItemImage.findByIdAndDelete(deletingMenuItem.itemImg);
  await MenuItem.findByIdAndDelete(deletingMenuItem.id);
  res.redirect('/menu');
});

// VIEWING MENU ITEM
// router.get('/:filename', async (req, res) => {
//   console.log(' ');
//   console.log('Trying to load the image');
//   const foodImage = await ItemImage.findOne({ filename: req.params.filename });
//   console.log(foodImage.filename);
//   // const currentItem = await MenuItem.findById({ itemImg: foodImage.id });
//   res.render('viewMenuItem', { req: req, image: foodImage });
// });

router.get('/:itemID', async (req, res) => {
  console.log('\n', 'Viewing Menu item');
  var currentMenuItem = await MenuItem.findOne({
    itemID: req.params.itemID,
  });
  console.log('Menu Item', currentMenuItem.itemName, 'is being viewed');
  console.log(`${currentMenuItem.itemName} data:`, currentMenuItem);
  var foodImage;
  if (currentMenuItem.itemImg) {
    foodImage = await ItemImage.findById({
      _id: currentMenuItem.itemImg,
    });
    console.log('Image name:', foodImage.filename);
  }

  res.render('viewMenuItem', {
    req: req,
    menuItem: currentMenuItem,
    image: foodImage,
  });
});

function checkAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin === true) {
    return next();
  }
  res.redirect('/');
}

module.exports = router;
