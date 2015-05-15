(function (global) {

  if ( typeof define === "function" && define.amd ) {
      define(['jquery'], function ($) {
        return factory(global, $)
      })
  } else {
      global.purple = factory(global, jQuery)
  }

  function factory(global, $) {
;

/**
 * private
 */
var __purple = {
  template: {}, // html模板 string类型
  dom: {}, // dom 对象
  apps: {
    __anonymous: {}
  },
  conf: {
    mainApp: null,
    scope: '/'
  }
}

function purple (name) {

  if (arguments.length === 0 ) {
    if (__purple.conf.mainApp !== null) {
      return __purple.apps[__purple.conf.mainApp]
    } else {
      return __purple.apps.__anonymous
    }
  } else {
    if (typeof __purple.apps[name] != 'undefined') {
      return __purple.apps[name]
    } else {
      return newApp(name)
    }
  }

  function newApp (name) {

    var app = __purple.apps[name] = {

      name: name,
      middleware: [],
      list: {},
      conf: {},
      currentHref: null,
      prevHref: null,

      /**
       * 配置参数
       */
      set: function(name, conf){
          this.conf[name] = conf
      },

      /**
       * 获取参数
       */
      get: function(name){
        return this.conf[name]
      },

      /*
       * 添加中间件
       */
      use: function (fn) {
        app.middleware.push(fn)
      },

      /**
       * 路由跳转
       */
      go: function(href){
        // 判断href是否合法
        // 判断href是否在list中

        var appHref = findRoute(href)
        if(appHref == null) {
          console.log('无法解析的地址：' + href);
          //location.href = href
          return
        }
        var fns = app.middleware.concat(appHref.fns)
        /**
         * request 对象
         */
        var req = {
          _end: false, // 跳转是否结束
          query: {}, // url中的请求参数
          rawUrl: '', // 原始请求连接
          paths: [] // 请求路径转数组
        }
        var res = {
          end: function () {
            req._end = true
          }
        }

        next()

        function findRoute(href){
          console.log(app.list)
          var _len = app.list.length
          for(var i=0; i<_len;i++) {
            if (app.list[i].regexp.test(href)){
              return app.list[i]
            }
          }
          return null
        }

        function next () {
          if (!req._end) {
            if (fns.length > 0) {
              fns.shift()(req, res, next)
            } else {
              res.end()
            }
          }
        }
      },

      back: function(){
        // 后退一步
      },

      route: function(rawHref) {
        // 判断href是否合法

        if (isArray(rawHref)) {
          var href = new RegExp('\/'+rawHref.join('\/')+'\/')
        } else if (isString(rawHref)) {
          var href = new RegExp('\/'+rawHref+'\/')
        } else if (isRegExp(rawHref)){
          var href = rawHref
        } else {
          // todo error handle
          return false
        }

        var appHref = app.list[href] = {
          regexp: href,
          get: function () {
            var fns = Array.call(null, arguments)
            appHref.fns = fns
          }
        }

        return appHref
      }
    }

    return app
  }

}


purple.set = function(name, conf){
  __purple.conf[name] = conf
}

purple.get = function(name){
  return __purple.conf[name]
}

purple.start = function(){

  console.log(purple())

  console.log('系统启动...')
  console.log('正在加载初始页...')
  purple().go(location.href)
  console.log('初始页加载成功...')
  console.log('正在监听URL变化...')

  var _len = document.scripts
  for (var i = 0; i < _len.length; i++) {
    var s = document.scripts[i]
    if (s.type === 'text/template') {
      __purple.template[s.attributes.getNamedItem('data-name').value] = s.innerText
    }
  }

  window.onpopstate = function(){
    var href = location.href
    purple().go(href)
  }

  document.addEventListener('click', eventClickAnchor,false)



  /**
   * 绑定a标签点击事件
   */

  function eventClickAnchor(event) {

      /**
       * 获取目标dom
       */
      var a = event.target

      /**
       * 如果是打开新标签，不处理
       */
      var href = $a.attr('href') || 0
      var target = $a.attr('target') || 0

      if (href != 0 && target==0) {

        var transport = parseURL(href)

        if (__purple.scope.test(transport.href)) {

          var machine = getRouter($a[0]);

          /**
           * 如果没有控制器，不处理（比如打算搞的spinner）
           */
          if ( machine != false ) {

            if ( event && event.preventDefault ) {
              event.preventDefault();
            } else {
              window.event.returnValue = false;
            }

            routerHandle({
              machine: machine,
              transport: transport,
              type: 'push',
              clearCache: false
            })

          }
          
        };

      };



  }



  // /** 
  //  * 监听url改变事件  window.onpopstate
  //  */

  function eventPopsteate(){

    var transport = parseURL(location.href)
    if (__purple.scope.test(transport.href)) {

      routerHandle({
        machine: __purple.machineMaster,
        transport: transport,
        type:'replace',
        clearCache: false
      })
    
    }

  }


}

;/**
 * 模板渲染
 */ 

purple.node = function (nodeName, stringName) {
  
  if (typeof stringDom !== 'undefined') {
    var dom = __purple.node[nodename] = string2dom(__purple.template[stringName])
  } else {
    var dom = __purple.node[nodename]
  }

  return domWrapper(dom)

  function string2dom (stringDom) {
    var wrapper= document.createElement('div')
    wrapper.innerHTML= stringDom
    return wrapper.firstChild
  }

  function domWrapper (dom) {
    dom.hide = function () {
      this.style.display = "none"
    }
    dom.show = function () {
      this.style.display = "inherit"
    }
    return dom
  }

}


function render (node, tree, animation) {
  var oldTree = __purple.currentPurpleTemplateStructure
  var diff = compareTree(oldTree, tree)
  /*  => 
   diff.show
   diff.hide
   */

  // 如果有动画控制器，将显隐控制权转移
  // 否则直接显隐
  if (typeof animation !== 'undefined') {
    animation(diff)
  } else {
    for (var i = 0; i < diff.show.length; i++) {
      purple.node(diff.show[i]).show()
    }
    for (var i = 0; i < diff.hide.length; i++) {
      purple.node(diff.hide[i]).hide()
    }
  }

  /**
   * 比较两个DOM结构，返回一个对象，包含3个数组对象
   */
  function compareTree (oldTree, tree) {
    var oldTreeArr = obj2arr(oldTree)
    var treeArr = obj2arr(tree)
    var diff = {
      show: [],
      hide: []
    }

    // 遍历出hide
    for (var i = 0; i < oldTreeArr.length; i++) {
      if (!in_array(oldTreeArr[i], treeArr)) {
        diff.hide.push(oldTreeArr[i][oldTreeArr[i].length-1])
      }
    }

    // 遍历出show，并构建新dom
    for (var i = 0; i < treeArr.length; i++) {
      var nodeName = treeArr[i][treeArr[i].length-1]
      diff.show.push(nodeName)
      if (typeof __purple.node[nodeName] === 'undefined') {
        var parentNodeName = treeArr[i][treeArr[i].length-2]
        var parentNode = __purple[parentNodeName]
        var jack = parentNode.querySelector('[data-id='+nodeName+']')
        if (jack == null) {jack = parentNode}
        jack.appendChild(purple(nodeName))
      }
    }
  }
};purple.debug = function () {
  return __purple
}

;

function isDefined(arg)   { return typeof arg != 'undefined' }
function isUndefined(arg) { return typeof arg == 'undefined' }
function isFunction(arg)  { return typeof arg == 'function'  }
function isBoolean(arg)   { return typeof arg == 'boolean'   }
function isString(arg)    { return typeof arg == 'string'    }
function isNumber(arg)    { return /^\d+$/.test(arg)         }
function isArray(arg)     { return arg instanceof Array      }
function isRegExp(arg)    { return arg instanceof RegExp     }
function isDate(arg)      { return arg instanceof Date       }
function isObject(arg)    { return arg instanceof Object     }
function isNull(arg)      { return arg === null || arg === ''}
function isEmpty(obj)     { for (var name in obj) { return false;} return true;}




/**
 * cookie 操作
 */
function setCookie(name,value,days) {//cookie名，值，时间
  removeCookie(name)
  var Days = days || 30 //此 cookie 将被保存 30 天
  var expires  = new Date()    //new Date("December 31, 9998");
  expires.setTime(expires.getTime() + Days*24*60*60*1000)
  var path = '/'
  document.cookie = name + "="+ escape(value) + ";expires=" + expires.toGMTString()+';path='+path
}

function getCookie(name) {
  var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
  if(arr != null) return unescape(arr[2]); return null;
}

function removeCookie(name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval=getCookie(name);
  if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}




/**
 * 获取对象长度
 */
function objLength(obj) {
  var j = 0;
  for ( i in obj ) {
    j++
  }
  return j;
}

/**
 * 检测是否在数组内
 */
function in_array(needle, haystack) {


    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(typeof haystack[i] == 'object') {
            if(arrayCompare(haystack[i], needle)) return true;
        } else {
            if(haystack[i] == needle) return true;
        }
    }
    return false;


}

function arrayCompare(a1, a2) {
  if (a1.length != a2.length) return false;
  var length = a2.length;
  for (var i = 0; i < length; i++) {
      if (a1[i] !== a2[i]) return false;
  }
  return true;
}


/**
 * 清除数组内指定元素
 */
function arrayClean(arr,deleteV) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == deleteV) {           
      arr.splice(i, 1);
      i--;  
    }
  } 
  return arr;
}

/**
 * 删除多维数组中的某个数组
 */

function deleteArr(bigarr,smallarr) {
  for (var i = 0; i < bigarr.length; i++) {
    if (arrayCompare(bigarr[i], smallarr)) {           
      bigarr.splice(i, 1);
      i--;  
    }
  } 
  return bigarr;
}

function cloneArray(arr) {
  return JSON.parse(JSON.stringify(arr))
}


/**
 * 获取obj的子对象数组
 */
function getKeys( obj ) {
  var ret = [];
  for ( var key in obj ) {
    if ( obj.hasOwnProperty(key) ) {
      ret.push( key );
    }
  }
  return ret;
};

/**
 * 遍历数组
 */
function forEach( array, iter ) {
  for ( var i = 0, l = array.length; i < l; i++ ) {
    var value = array[i];
    iter.call( this, value, i, array );
  }
};

/**
 * 获取对象中的元素，并保存为数组
 */
function objElements (obj) {
  var result = [];

  function re(obj) {
    Object.keys(obj).forEach(function(item) {
      if (obj[item] instanceof Object && !(obj[item] instanceof Array)) { // 不包含数组
      // if (obj[item] instanceof Object) { // 包含数组

        result.push(item);
        re(obj[item]);
      }
    });
  }

  re(obj);
  return result;
}




/**
 * 二叉树对象转一维数组
 */
function obj2arr(obj) {
  var arr = [];
  re(obj, []);
  return arr;

  function re(obj, prev) {
    Object.keys(obj).forEach(function(item) {
      var hehe = [];
      // if (obj[item] instanceof Object && !(obj[item] instanceof Array)) { // 不包含数组
      if (obj[item] instanceof Object) { // 包含数组
        if (prev.length) {
          hehe = prev.concat()
        }
        hehe.push(item)
        arr.push(hehe);
        re(obj[item], hehe);
      }
    });
  }

}








/**
 * 在父级元素中查找router，找得到返回routername，招不到返回false
 */
function getRouter(dom) {

  var p = getParent(dom);

  if (p.nodeName == 'HTML') {
    return false;
  }
  
  /**
   * 获取id
   */
  var pid = p.id

  if (pid!='' && isRouter(pid)) {
    /**
     * 返回router name
     */
    return pid.substring(5)
  }
  return getRouter(p)

  /**
   * 获取父级元素
   */
  function getParent(dom) {
    return dom.parentNode || dom.parentElement
  }

  /**
   * 检查是否是state
   */
  function isRouter(id) {
    return /state[a-z]+/.test(id)
  }

}






/**
 * 在父级元素中查找标签
 */
function getParentByTag(dom, nodename) {
  if (dom.nodeName == 'BODY') {
    return false;
  }

  if (dom.nodeName == nodename) {
    return p
  };

  var p = getParent(dom);
  return getParentByTag(p)

  /**
   * 获取父级元素
   */
  function getParent(dom) {
    return dom.parentNode || dom.parentElement
  }
}



function closest(child, target) {


}
;
  return purple


} // END factory

})(this);