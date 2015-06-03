/**
 * Create by Hansel on 2015-06-03 22:55:24.
 */

var glob = require('glob');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var async = require('async');

var cwd = path.join(__dirname, '../public/template/');
var src = '*.html';
var dest = path.join(__dirname, '../public/template.html');
var ext =  '.html';

var distData = "";
var srcFilesPathes = getGlobbedFiles(cwd+src);
async.each(srcFilesPathes, function(srcFilePath, callback){

  fs.readFile(srcFilePath, function(err, data){
    if(err){
      callback('read file fail');
    } else {
      var dataname = srcFilePath.replace(cwd, '').replace(ext, '');
      var wrappedData = '<script type="text/template" data-name="'+dataname+'">'
      + data
      + '</script>';
      distData += wrappedData;
      callback(null);
    }
  })

}, function(err){

  if(err){
    console.error(err);
  } else {

    fs.writeFile(dest, distData, function(err) {

      if (err){
        console.error(err);
      } else {
        console.log('combine templates success!');
      }

    });

  }

});

/**
 * getGlobbedFiles
 * @param {strng|array} globPatterns
 * @param {string} removeRoot
 * @returns {Array}
 */
function getGlobbedFiles (globPatterns, removeRoot) {
  // For context switching
  var _this = this;

  // URL paths regex
  var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

  // The output array
  var output = [];

  // If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob
  if (_.isArray(globPatterns)) {
    globPatterns.forEach(function(globPattern) {
      output = _.union(output, _this.getGlobbedFiles(globPattern, removeRoot));
    });
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {

      var files = glob.sync(globPatterns);
      if (removeRoot) {
        files = files.map(function(file) {
          return file.replace(removeRoot, '');
        });
      }
      output = _.union(output, files);

    }
  }
  return output;
};
