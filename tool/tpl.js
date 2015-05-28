'use strict';

/**
 * 加载fs模块
 */
var fs = require('fs');

/**
 * 测试读取文件和console
 */
// var file = fs.readFileSync('../src/index.html', "utf8");
// console.log(file);

/**
 * 批量注册html
 * @param {code} html文件编码
 * @param {htmlpath} html文件路劲
 * @param {htmlsuffix} html文件名后缀
 * @param {regarr} 需要注册的html的文件名（jack名）
 */

var code = 'utf8';
var htmlpath = './src/html-min';
var hash_suffix = '_'+'hfhg1adf'
var targetFilename = "./dist/smile_oauth2_hfhg1adf/js/oauth2_tpl" + hash_suffix + ".js"
var regarr = []

walk2(htmlpath)
var script_str = concatStr(regarr)

/**
 * 创建文件
 */

fs.open(targetFilename, "w", '0644', function(e,fd) {
  if(e) throw e;
  fs.write(fd, script_str, 0, 'utf8', function(e){
    if(e) throw e;
    fs.closeSync(fd);
  })
});

function walk2 (path) {
  var dirList = fs.readdirSync(path);
  dirList.forEach(function(item){

    if(fs.statSync(path + '/' + item).isDirectory()){
      walk2(path + '/' + item);
    }else{

      if (/.+\.html/.test(item)) {
        regarr.push(path + '/' + item);
      };

    }
  });

}

function getName (filename) {

  console.log(filename)

// /(?!dist\/html\/)(.*)(?=\.html)/.exec(regarr[i]);
  return /.*(?=\.html)/.exec(filename.split(htmlpath+'/')[1])[0]

}

function concatStr (regarr) {

  var script_str = '(function (root, factory) {'
    + '  if (typeof define === "function" && define.amd) {'
    + '    define(["purple"], factory);'
    + '  } else {'
    + '    root.loadtpl = factory();'
    + '  }'
    + '}(this, function () {'
    + '  function loadtpl() {'

  for (var i = 0; i < regarr.length; i++) {
    script_str += "purple.html('";
    script_str += getName(regarr[i])
    script_str += "','";
    script_str += fs.readFileSync(regarr[i], code);
    script_str += "');";
  };

  script_str += '  }'
  + '  return loadtpl'
  + '}));'

  console.log(script_str)
  return script_str
}

