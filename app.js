require('dotenv/config');

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');

const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

const menuRouter = require('./routes/menu');
const aboutRouter = require('./routes/about');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/registration');

//EXPRESS setup
const app = express();
app.use(express.urlencoded({ extended: false }));

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Connect to Database
mongoose.connect(process.env.DB_Connection, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once('open', () => console.log('Connected to Database'));

//Flash & Session
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/');
  }
  next();
}

//Logging Out
app.delete('/logout', (req, res) => {
  req.logOut();
  res.redirect('/');
});

//Import routes
app.use('/menu', menuRouter);
app.use('/about', aboutRouter);
app.use('/login', loginRouter);
app.use('/registration', registerRouter);

const User = require('./models/users');

app.use('/', (req, res) => {
  res.render('home', { req: req });
});

//Listening
app.listen(3000, () => {
  console.log('Server on port 3000');
});
