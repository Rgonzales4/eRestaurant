require('dotenv/config');

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');

const menuRouter = require('./routes/menu');
const aboutRouter = require('./routes/about');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/registration');
const bookingRouter = require('./routes/booking');

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

//Listening
app.listen(3000, () => {
  console.log('Server on port 3000');
});

//Import routes
app.use('/menu', menuRouter);
app.use('/about', aboutRouter);
app.use('/login', loginRouter);
app.use('/registration', registerRouter);
app.use('/booking', bookingRouter);

const User = require('./models/users');

app.use('/', (req, res) => {
  // if (!req.locals.user) {
  //   const sentUser = new User();
  // } else {
  //   const sentUser = req.locals.user;
  // }
  res.render('home', {req: req});
});

//Logging In Functions
