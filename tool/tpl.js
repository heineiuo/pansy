// 'use strict';
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
var htmlpath = 'dist/html/main';
var htmlsuffix = '.html'
var regarr = walk3(htmlpath)

console.log(regarr)


function walk3(path){   // 深度优先
  var fileList = []
  walk2()
  return fileList

  function walk2 (argument) {
    var dirList = fs.readdirSync(path);
    dirList.forEach(function(item){
      if(fs.statSync(path + '/' + item).isDirectory()){
        walk2(path + '/' + item);
      }else{

        if (/.+\.js/.test(item)) {
          fileList.push(path + '/' + item);
        };

      }
    });

  }


}




/**
 * @param {script_str} 
 */
var script_str = '';
for (var i = 0; i < regarr.length; i++) {
  script_str += "purple.html('";
  script_str += regarr[i];
  script_str += "','";
  script_str += fs.readFileSync(htmlpath+regarr[i]+htmlsuffix, code);
  script_str += "');";
};

/**
 * 创建文件
 */

 fs.open("webapp/index.html","w",0644,function(e,fd){
    if(e) throw e;
    fs.write(fd, script_str,0,'utf8',function(e){
        if(e) throw e;
        fs.closeSync(fd);
    })
});