
const ejs  = require("ejs"),
      fs   = require("fs"),
      {execSync} = require("node:child_process"),
      replace = require("replace-in-file");





/*********************** INPUTS AND OUTPUT FOLDERS ****************************/

const htmlInputPath = __dirname + "/../dev/templates/html";
const htmlOutputPath = __dirname + "/../dev/public";
const htmlDir = fs.readdirSync(htmlInputPath);

const ejsInputPath = __dirname + "/../dev/templates/ejs";
const ejsOutputPath = __dirname + "/../dev/views";
const ejsDir = fs.readdirSync(ejsInputPath);





/************************* HELPER FUNCTIONS ***********************************/

/* Main script: Compiles an ejs file*/
const ejsComp = function (inputPath, outputPath, inputFile, outputFile = inputFile){
  execSync(`ejs ${inputPath}/${inputFile} -o ${outputPath}/${outputFile}`), (err) => {
    if (err) {
        console.error("couldn't compile ejs: ", err);
        return;
    }
  };
};





/* Options and function that replace all occurences of <~ and ~> into proper ejs code */
const replaceOptions = {
  from: ["~>", "<~"],
  to: ['%>', '<%']
};

const replaceEJS = function (){
  try {
    const results = replace.sync(replaceOptions);
  }
  catch (error) {
    console.error('Error occurred:', error);
  }

};





/************************* COMPILING HTML AND EJS *****************************/

htmlDir.forEach((inFile) => {
  let outFile = inFile.slice(0, -3) + "html";
  ejsComp(htmlInputPath, htmlOutputPath, inFile, outFile);
});



ejsDir.forEach((file) => {
  replaceOptions.files = `${ejsOutputPath}/${file}`;
  ejsComp(ejsInputPath, ejsOutputPath, file);
  replaceEJS();
});
