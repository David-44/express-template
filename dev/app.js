"use strict";

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const robots = require('express-robots-txt');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');

require('dotenv').config({path: __dirname + '/.env'});

const models = require('./models/models');
const router = require('./routers/routes');
const controller = require('./controllers/controller');
const port = process.env.PORT || 3000;





/************************* BASIC MIDDLEWARE AND SETUP *************************/

// App setup
const app = express();



// Parsing requests
app.use(express.urlencoded({extended: false}));



// Setting up cache for get requests but only for production
let setCache = function (req, res, next) {
  const period = 60 * 60 * 24 * 365;

  if (req.method == 'GET') {
    res.set('Cache-control', `public, max-age=${period}`);
  } else {
    res.set('Cache-control', `no-store`);
  }
  next();
}
if (process.env.NODE_ENV == "production"){
  app.use(setCache);
}



// Serving static assets, CSS and JS scripts + robots file for SEO
app.use(express.static(__dirname + '/public'));
app.use(robots({ UserAgent: '*'}));



// Setup EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));





/************************************ DB INIT *********************************/

// Used to setup the auto reconnect to fire every 5 minutes
// useNewUrlParser is a required option
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};



// establishes connection, takes URI directly from process.env
mongoose.connect(process.env.DB_CONNECT, mongooseOptions, err => {
  if (err) {
    console.error('Unable to connect to DB server. Please start the server. Error:', err);
  } else {
    // initialises all user schemas
    console.log("connected to DB");
  }
});

const db = mongoose.connection;

// disconnects on error in order to force an auto reconnect
db.on('error', error => {
  console.error('Error in MongoDb connection: ' + error);
  mongoose.disconnect();
});





/************** SANITIZATION AND SECURITY SPECIFIC MIDDLEWARE *****************/

// set limit request from same API in timePeriod from same ip
const limiter = rateLimit({
  max: 100, //   max number of limits
  windowMs: 60 * 60 * 1000, // hour
  message:
    ' Too many req from this IP , please Try  again in an Hour ! ',
});
app.use('/api', limiter);



// set security http headers
app.use(helmet());



// Cleans xss data (use before calling any route)
app.use(xss());



// Protects against parameteer pollution attack
app.use(hpp());



// Data sanitization against NoSql query injection
app.use(mongoSanitize());





/********************************* SERVER START *******************************/

// Setup router
app.use('/', router);



app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
