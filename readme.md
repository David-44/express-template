
# TEMPLATE FOR WEBSITES USING EXPRESS AND EJS





## 1) BASICS
Simple development and production boilerplate for express MVC websites.
This is tailored to be used with Digital Ocean for pushing only the content of /dist to the main site.
All the development is made in /dev and files are copied to dist using npm scripts.

The syntax and organisation of the front end follows the BEM and SMACSS conventions.
Scripts are organised in modules.





## 2) INITIALISING:

1. Add a title, author and description to package.json
2. `$ npm run first`
- It deletes the current .git repo and .gitignore
- It creates a git repo for the dev environment and for the live one
- It installs necessary node modules at the root
3. Add .env to both dev/.gitignore and dist/.gitignore before any modification to .env





## 3) INTERFACE:

- `$ npm run first`: initialising (see above)
- `$ npm run watch`: watches for changes to scss, templates ans scripts and compiles accordingly (see each section for details). Also watches for change in the main package.json
- `$ npm run prod `: runs production site, access with http://localhost:4000
- `$ npm run dev `: runs development site, access with http://localhost:3000

- `$ npm run front`: Copies assets, minifies CSS, js and html and copies everything to dist/public
- `$ npm run back`: Copies MVC folders to dist, as well as package.json and app.js

- `$ npm run watch`: Watches for EJS templates, scripts, sass files  and package.json being modified, then compiles the relevant files





## 4) CONTENT

### html and ejs
Everything is in /dev/template/ with 3 subfolders:
- partials:
It contains some already made chunks of code that are mostly placeholders.
- ejs contains all files that should be compiled as ejs
When using it, the syntax for everything that should still be used as ejs function
should use the syntax <~ and ~> instead of <% and %>.
- html, all the files that should be compiled as html go there.

- The html only files are minified and copied to dist with the frontend
while the ejs files are copied as such with the backend.

- All the work happens in a config file: build-config/templates.js

- To compile once (without watching): `npm run templates`.



### Sass
Uses dart-sass

- The folder organisation is heavily based on [Sass Guidelines](http://sass-guidelin.es/).
- The content of the _variables file is set to default value so that the watch command will work right away. These values are not here to match anything, they're just placeholders.
- There are a few heplful functions and mixins in /abstract.
- There is no CSS normalise or reset but some of the rules in /base/base are based on CSS normalise. Other rules are based on my experience.
- /base/typography and layout/container contain rules that I find useful but are opinionated.
- All other files are empty.

- To compile once (without watching): `npm run scss`.



### Scripts
Uses the bundler [Parcel](https://www.npmjs.com/package/parcel/v/2.11.0) to compile all scripts into one file.

- Entry point is index.js
- To compile once (without watching): `npm run jsbundle`.



### An express server
Entry point app.js.
Runs with `npm run prod` or `npm run dev`.
Uses the following folders:
- models
- controllers
- views (containing only ejs files)
- routers
If more files or folders are added, the package.json scripts should be modified accordingly.



### Other files
- procfile, used only by Digital Ocean and only in dist folder.
