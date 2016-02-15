'use strict';
console.log('test');


var walk    = require('walk');
var fs = require("fs");
var files   = [];
var offsets = [];
// Walker options
console.log(process.argv);
var rootFolder = null;
var templatesFolder = null;
var filePath = "fp1911.html";
if(!process.argv[2]){
    console.log('usage: fudgepacker.js [index.html root folder] [templates folder] [optional: output path]');
    process.exit(1);
}else {
    rootFolder = process.argv[2];
    templatesFolder = process.argv[3];
    if(process.argv[4]){
        filePath = process.argv[4];
    }
}
process.chdir(rootFolder);
var walker  = walk.walk(templatesFolder, { followLinks: false });
var strBuffer = "";
walker.on('file', function (root, fileStats, next) {
    // Add this file to the list of files
    var rroot = root.replace(/\\/g,"/");
    var fpath = rroot + '/' + fileStats.name;
    fpath = fpath.replace(/\\/g,"/");
    fpath = fpath.replace(/\/\/+/g, '/');

    fs.readFile(fpath,"utf-8", function (err, buffer) {
        files.push(fpath);

        strBuffer += buffer;
        offsets.push(strBuffer.length);
        next();
    });



});

walker.on('end', function() {
    var result = "<!-- fudgepacker1911begin ";
    for(var i = 0, l = offsets.length; i < l; i++){
        result += offsets[i] + " " +files[i] + " ";
    }
    result += "fudgepacker1911end -->";
    var toWrite = strBuffer + result;
    fs.writeFile(filePath, toWrite, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });

});