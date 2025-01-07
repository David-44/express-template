"use strict";

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const robots = require('express-robots-txt');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const {xss} = require('express-xss-sanitizer');
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
const cachePeriod = 60 * 60;
let setCache = function (req, res, next) {

  if (req.method == 'GET') {
    res.set('Cache-control', `public, max-age=${cachePeriod}, must-revalidate`);
  } else {
    res.set('Cache-control', `no-store`);
  }
  next();
}
if (process.env.NODE_ENV == "production"){
  app.use(setCache);
}



// Serving static assets, CSS and JS scripts + robots file for SEO
var staticOptions = {
  setHeaders: function (res, path, stat) {
    res.set('Cache-control', `public, max-age=${cachePeriod}`) // Uses cache control time period
  }
}
app.use(express.static(__dirname + '/public', staticOptions));
app.use(robots({ UserAgent: '*'}));



// Setup EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));





/************************************ DB INIT *********************************/

// establishes connection, takes URI directly from process.env
mongoose.connect(process.env.DB_CONNECT);
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
// Note: uses a nonce when using inline scripts, it should be the same as the nonce attribute
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'nonce-24666'", "'unsafe-inline'"]
    },
  })
);



// Cleans xss data (use before calling any route)
app.use(xss());



// Protects against parameter pollution attack
app.use(hpp());



// Data sanitization against NoSql query injection
app.use(mongoSanitize());





/********************************* SERVER START *******************************/

// Setup router
app.use('/', router);



app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
