//NOT FINISHED :,)

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const passport = require('passport');

const User = require('../models/users');

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    const user = await User.findOne({ email: email });
    console.log(await user);
    if (!user) {
      return done(err, false, { message: 'User not found' });
    }

    try {
      await bcrypt.compare(password, user.password, function (err, res) {
        if (err) {
          return done(err);
        } else if (res === false) {
          return done(err, false, {
            message: 'Username / Password is incorrect',
          });
        } else {
          console.log('logged in');
          return done(err, user);
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
  passport.serializeUser(function (user, done) {
    console.log(user.id);
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
}

module.exports = initialize;
