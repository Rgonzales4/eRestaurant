const express = require("express");
const { syncIndexes } = require("../models/users");
const router = express.Router();

const User = require("../models/users");

router.get("/", checkAuthenticated, async (req, res) => {
  const userAccount = await User.findOne({ email: req.user.email });
  console.log(
    `User ${userAccount.userId} ${userAccount.firstName} ${userAccount.lastName} page open`
  );
  res.render("profile", { req: req, user: userAccount, adminEdit: false });
});

router.get("/editProfile", checkAuthenticated, async (req, res) => {
  const userAccount = await User.findOne({ email: req.user.email });
  console.log(
    `Edit User ${userAccount.userId} ${userAccount.firstName} ${userAccount.lastName} page open`
  );
  res.render("editProfile", { req: req, user: userAccount, adminEdit: false });
});

//UPDATING THE PROFILE FUNCTION
router.post("/editProfile", checkAuthenticated, async (req, res) => {
  const filter = { email: req.user.email };
  const update = { firstName: req.body.firstName, lastName: req.body.lastName };
  console.log(update);
  await User.findOneAndUpdate(filter, update);
  res.redirect("/profile");
});

//DELETING THE USER ACCOUNT
router.get("/deleteProfile", checkAuthenticated, async (req, res) => {
  console.log(`Deleting user ${req.user.firstName} from the database`);
  const userToDelete = req.user.email;
  await User.findOneAndDelete({ email: userToDelete });
  req.logout();
  res.redirect("/");
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin === true) {
    return next();
  }
  res.redirect("/");
}

module.exports = router;
