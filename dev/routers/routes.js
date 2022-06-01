
"use strict";

const express = require('express');
const path    = require('path');

var router = express.Router();





/********************************* GET ROUTES *********************************/

// Example route with ejs render
router.get(['/', '/index'], async (req, res) => res.render('index', {blogs: await blog.blogRender()}));



// example route with static file
router.get('/about', (req, res) => res.sendFile(path.join(__dirname + '/../views/about.html')));





// DEFAULT ROUTE (can be replaced with 404)
router.get('*', (req, res) => res.redirect('/'));





/******************************** POST ROUTES *********************************/

// Example post route
router.post('/process', (req, res) => res.render('contact', {message: email.messages.error}));





/****************************** IMPORT IN APP.JS ******************************/

module.exports = router;
