const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/users');

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      console.log('User not found');
      return done(null, false, { message: 'User not found' });
    }

    try {
      await bcrypt.compare(password, user.password, function (err, res) {
        if (err) {
          return done(err, false, {
            message: 'Username / Password is incorrect',
          });
        } else if (res === false) {
          return done(err, false, {
            message: 'Username / Password is incorrect',
          });
        } else {
          console.log('User email that logged in:', user.email);

          return done(err, user);
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

  passport.serializeUser(function (user, done) {
    if (user != null) {
      console.log('User id that logged in:', user.id);
      done(null, user.id);
    }
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
}

module.exports = initialize;
