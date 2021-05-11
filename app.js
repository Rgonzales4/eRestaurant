require('dotenv/config');

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const MongoDBStore = require('connect-mongo')(session);
const methodOverride = require('method-override');

const menuRouter = require('./routes/menu');
const aboutRouter = require('./routes/about');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/registration');
const bookingRouter = require('./routes/bookings');
const databaseRouter = require('./routes/database');
const profileRouter = require('./routes/profile');

//EXPRESS setup
const app = express();
app.use(express.urlencoded({ extended: false }));

// EJS Setup
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('uploads'));
app.use(express.static('views'));

//Connect to Database
mongoose.connect(process.env.DB_Connection, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once('open', () => console.log('Connected to Database'));

mongoose.set('useFindAndModify', false);

//Flash & Session
app.use(flash());

const store = new MongoDBStore({
  url: process.env.DB_Connection,
  secret: process.env.SESSION_SECRET,
  touchAfter: 60* 60* 3,
})

const sessionConfig = {
  store,
  name: 'session',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
    maxAge: 1000 * 60 * 60 * 24 * 3,
  }
}

app.use(session(sessionConfig));
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
app.use(express.static('css'));
app.use('/menu', menuRouter);
app.use('/about', aboutRouter);
app.use('/login', loginRouter);
app.use('/registration', registerRouter);
app.use('/bookings', bookingRouter);
app.use('/database', databaseRouter);
app.use('/profile', profileRouter);

app.use('/', (req, res) => {
  res.render('home', { req: req });
});

//Listening
app.listen(3000, () => {
  console.log('Server on port 3000');
});
