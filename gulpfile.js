
const {src, dest, watch, parallel, series} = require("gulp");
const htmlmin = require('gulp-htmlmin');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const sass = require('gulp-sass')(require('node-sass'));
const gzip = require('gulp-gzip');
const concat = require('gulp-concat');

const devPath = 'dev/';
const prodPath = 'dist/';
const publicFolder = 'public/';






/********************* SENDING FRONT END FOR PRODUCTION ***********************/

/* PUBLIC FOLDER */

// Cleaning the public folder, needs to be done before copying anything
function cleanPublic(cb){
  del.sync(prodPath + publicFolder);
  cb();
}



// Copying media assets
function copyAssets(cb) {
  src(devPath + publicFolder + 'assets/**/*')
    .pipe(dest(prodPath + publicFolder + 'assets'));
  cb();
}



// Minifying CSS
function minifyCSS(cb){
  src(devPath + publicFolder + 'main.css')
    .pipe(cleanCSS())
    .pipe(dest(prodPath + publicFolder));
  cb();
}



// Minifying JS
function minifyJS(cb){
  src(devPath + publicFolder + 'scripts.js', {allowEmpty: true})
    .pipe(uglify({}))
    .pipe(dest(prodPath + publicFolder));
  cb();
}





/* VIEW FOLDER */

// Minifying HTML and copying files to the /views folder
function minifyHTML(cb) {
  src(devPath + 'views/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      conservativeCollapse: true,
      removeComments: true
    }))
    .pipe(dest(prodPath + '/views'));
  cb();
}



function copyTemplates(cb) {
  src(devPath + 'views/*.ejs')
    .pipe(dest(prodPath + '/views'));
  cb();
}





/********************* SENDING BACK END FOR PRODUCTION ************************/

// Copying package.json and app.js (used by heroku)
function copyRootFiles(cb) {
  src(['./package.json', devPath + 'app.js'])
    .pipe(dest(prodPath));
  cb();
}



// Copying routers
function copyRouters(cb) {
  src(devPath + 'routers/*')
    .pipe(dest(prodPath + 'routers'));
  cb();
}



// Copying Models
function copyModels(cb) {
  src(devPath + 'models/*')
    .pipe(dest(prodPath + 'models'));
  cb();
}



// Copying Controllers
function copyControls(cb) {
  src(devPath + 'controllers/*')
    .pipe(dest(prodPath + 'controllers'));
  cb();
}





/*************************** COMPILING DEV FILES ******************************/

/* Functions used to compile from templates static files in the dv environment */

// Building HTML files from EJS
function generateHTML(cb) {
  src(devPath + 'templates/html/*.ejs')
    .pipe(ejs())
    .pipe(rename({ extname: '.html' }))
    .pipe(dest(devPath + 'views/'));
  cb();
}



// Building EJS templates
function generateTemplate(cb) {
  src(devPath + 'templates/ejs/*.ejs')
    .pipe(ejs({}, {rmWhitespace: true}))
    .pipe(replace('~>', '%>'))
    .pipe(replace('<~', '<%'))
    .pipe(dest(devPath + 'views/'));
  cb();
}



// Building CSS from sass
function generateCSS(cb) {
  src(devPath + '/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(dest(devPath + publicFolder));
  cb();
}



// concatenating JS files
function concatScript(cb) {
  src(devPath + 'scripts/*.js')
    .pipe(concat('scripts.js'))
    .pipe(dest(devPath + publicFolder));
  cb();
}



// Copying package.json to dev folder (for using with git)
function copyPackage(cb) {
  src('./package.json')
    .pipe(dest(devPath));
  cb();
}





/********************** WATCH FOR CHANGE ON DEV FILES *************************/

// Basic function for static site made out of a template
// Watch for both scss and html
function watchDev(cb) {
  watch(devPath + 'templates/html/*', generateHTML);
  watch(devPath + 'templates/ejs/*', generateTemplate);
  watch(devPath + 'templates/partials/*', series(generateTemplate, generateHTML));
  watch(devPath + 'scss/**/*', generateCSS);
  watch(devPath + 'scripts/*', concatScript);
  watch('./package.json', copyPackage);
}



// Watches for change on Sass files only
function watchSass(cb) {
  watch(devPath + 'scss/**/*', generateCSS);
}





/*************************** EXPORTING INTERFACES *****************************/

/* PRODUCTION INTERFACE */

// Replacing front-end files
exports.deployFront = series(cleanPublic, copyAssets, minifyHTML, copyTemplates, minifyCSS, minifyJS);

// Replacing back-end files
exports.deployBack = series(copyRootFiles, copyRouters, copyModels, copyControls);

// Cleaning the public production folder
exports.clean = cleanPublic;





/*********************** DEV INTERFACE: WATCH FILES ***************************/

// Watching for change on dev files
exports.watchDev = watchDev;

// Watching for change on sass files
exports.sass = watchSass;
