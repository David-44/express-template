
# STATIC WEBSITES BOILERPLATE





## 1) BASICS
Simple development and production boilerplate for express MVC websites.
This is tailored to be used with heroku.com for pushing only the content of /dist to the main site.
All the development is made in /dev and files are copied to dist using gulp





## 2) INITIALISING:

1. Add a title, author and description to both package.json files (dev and dist).
2. `$ npm run first`
- It deletes the current .git repo and .gitignore
- It creates a git repo for the dev environment and for the live one.
- It installs necessary node modules at the root
3. Add .env to both dev/.gitignore and dist/.gitignore before any modification to .env is done





## 3) INTERFACE:

- `$ npm run first`: initialising (see above).
- `$ npm run watch`: runs sass watch.
- `$ npm run prod `: runs production site, access with http://localhost:4000
- `$ npm run dev `: runs development site, access with http://localhost:3000

- `$ gulp clean `: Cleans the public production folder.
- `$ gulp deployFront`: Copies assets, minifies CSS, js and html copies ejs templates and html to the views folder
- `$ gulp deployBack`: Copiews MVC folders to dist, as well as package.json and app

- `$ gulp sass`: same as npm run watch
- `$ gulp watchDev`: Watches for EJS templates, scripts and sass files being modified





## 4) CONTENT

### html and ejs
Everything is in /dev/template/ with 3 subfolders:
- partials:
It contains some already made chunks of code that are mostly placeholders.
The main entry point is the layout file

- ejs contains all files that should be compiled as ejs
When using it, the syntax for everything that should still be used as ejs function
should use the syntax <~ and ~> instead of <% and %>

- html, all the files that should be compiled as html go there



### Sass
Needs node-watch (installed when initialising).

Runs with `npm run watch`.

- The folder organisation is heavily based on [Sass Guidelines](http://sass-guidelin.es/).
- The content of the _variables file is set to default value so that the watch command will work right away. These values are not here to match anything, they're just placeholders.
- There are a few heplful functions and mixins in /abstract.
- There is no CSS normalise or reset but some of the rules in /base/base are based on CSS normalise. Other rules are based on my experience.
- /base/typography and layout/container contain rules that I find useful but are opinionated.
- All other files are empty.



### A gulp file
Uses the command `gulp deploy` to:
- copy the content of /assets to /dist/public/assets/ and keep the folder structure.
- minify index.html, main.css and scripts.js and copy them to /dist/public.



### An express server
Entry point app.js.
Runs with `npm run prod` or `npm run dev`.
Uses the following folders:
- models
- controllers
- views (with a mix of ejs and html files)
- routers
If more files or folders are added, gulpfile.js should be modified to deal with them
At the moment, the models and controllers are empty, might be filled at a later date



### Other files
- procfile, used only by heroku and only in dist folder
