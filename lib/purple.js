(function (global) {

  if ( typeof define === "function" && define.amd ) {
    define(function () {
      return factory(global)
    })
  } else {
    global.purple = factory(global)
  }

  function factory(global) {
;

/**
 * private
 */
var __purple = {
  tree: {},
  template: {}, // html模板 string类型
  node: {}, // dom 对象
  app: {
    __anonymous: {}
  },
  conf: {
    mainApp: null,
    scope: document.body,
    filter: '/'
  }
};

function purple (name) {

  // 如果没传入name，返回主app或者匿名app
  if (arguments.length === 0 ) {
    if (__purple.conf.mainApp !== null) {
      return __purple.app[__purple.conf.mainApp]
    } else {
      return __purple.app.__anonymous
    }

  // 否则，返回已建立的app，或者建立app
  } else {
    if (isDefined(__purple.app[name])) {
      return __purple.app[name]
    } else {
      return newApp(name)
    }
  }

  // 生成app
  function newApp (name) {

    var app = __purple.app[name] = {

      name: name,

      // 中间件
      middleware: [],

      // 路由集合
      list: {},

      // 配置
      conf: {},

      // 当前href
      currentHref: null,

      // 之前的href
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
      go: function(href, type){

        var req = parseURL(href)
        // 跳转是否结束
        req._end = false
        // 原始请求连接
        req.rawUrl = href 
        // 堆栈方式
        req.historyStateType = type || 'push'

        var res = {
          timestamp: Date.now(),

          prevView: null,

          end: function () {
            req._end = true
            if(this.prevView != null) {
              this.prevView.remove()
            }
            console.log('路由跳转完毕...')
          },

          render: function(tree, animation) {
            render(this, tree, animation)
          }
        }

        // 使用中间件
        var fns = [findRoute].concat(app.middleware)

        next()

        /*
          查找路由器
         */
        function findRoute(req, res, next) {
          console.log('正在解析地址：'+req.rawUrl)

          // 判断href是否合法
          // 判断href是否在list中
          for(key in app.list) {
            if (app.list[key].regexp.test(req.pathname)) {
              console.log('解析路由成功：'+app.list[key].regexp)

              if (req.historyStateType == 'replace') {
                history.replaceState('data', 'title', req.parsedURL)
              } else {
                history.pushState('data', 'title', req.parsedURL)
              }

              fns = fns.concat(app.list[key].fns)

              return next()
            }
          }

          console.warn('无法解析的地址：' + req.pathname)
          res.end()
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
        history.back()
      },

      route: function(rawHref) {
        // 判断href是否合法

        if (isArray(rawHref)) {
          var href = new RegExp('^\/'+rawHref.join('\/')+'\/$')
        } else if (isString(rawHref)) {
          var href = new RegExp('^'+rawHref+'$')
        } else if (isRegExp(rawHref)){
          var href = rawHref
        } else {
          // todo error handle
          return false
        }

        var appHref = app.list[href] = {
          regexp: href,
          get: function () {
            appHref.fns = Array.prototype.slice.call(arguments,0)
          }
        }

        return appHref
      }

    }

    return app
  }

}

purple.template = function(name){
  return __purple.template[name] || '<div></div>';
};


purple.set = function(name, conf){
  __purple.conf[name] = conf
};

purple.get = function(name){
  return __purple.conf[name]
};

purple.scope = function(){
  return __purple.conf.scope
}

purple.start = function() {

  var _len = document.scripts.length
  for (var i = _len-1; i > -1; i--) {
    var s = document.scripts[i]
    if (s.type === 'text/template') {
      __purple.template[s.attributes.getNamedItem('data-name').value] = s.innerText
      s.remove()
    }
  }

  console.log('系统启动成功...')

  purple().go(location.href)
  console.log('初始页加载成功...')

  window.addEventListener('popstate', eventPopstate, false)
  console.log('正在监听URL变化...')

  document.addEventListener('click', eventClickAnchor, false)
  console.log('正在监听链接点击...')


  function eventPopstate(){
    var href = location.href
    purple().go(href, 'replace')
  }

  function eventClickAnchor(event) {
    var href = findClosestAnchorHref(event.target)
    if (href !== null) {
      event.preventDefault()
      purple().go(href)
    }

    function findClosestAnchorHref(dom) {
      var href
      r(dom)
      return href

      function r(dom) {
        if (dom == null) {
          href = null
        } else if (dom.nodeName == 'A') {
          href = dom.href || null
        } else  {
          r(dom.parentNode)
        }
      }

    }

  }

}

;/**
 * 模板渲染
 */

purple.node = function (nodeName, stringDom) {

  if (isDefined(stringDom)) {
    var dom = __purple.node[nodeName] = string2dom(stringDom)
    dom.style.display = 'none';
  } else {
    var dom = __purple.node[nodeName] || null
  }

  return dom

  function string2dom (stringDom) {
    var wrapper= document.createElement('div')
    // stringDom = stringDom.replace(/[\r\n\s]/g, "") // ERROR
    wrapper.innerHTML = stringDom
    deleteChildTextNode(wrapper)
    return wrapper.firstChild
  }

  function deleteChildTextNode (dom) {
    r(dom)
    return dom

    function r(dom) {
      if (dom.childNodes.length > 0) {
        for (var i = dom.childNodes.length-1; i > -1; i--) {
          if (dom.childNodes[i].nodeName != '#text') {
            // 心累了，不递归了
          } else {
            dom.childNodes[i].remove()
          }
        }
      }
    } // end r
  } // end deleteChildTextNode

};



function render(res, tree, animation) {
  // 判断是否要清空旧的视图
  if(res.prevView == null) {
    res.prevView = purple.node('prevView', '<div id="prevView"></div>');
    for(var i=purple.scope().childNodes.length - 1; i> -1; i--){
      res.prevView.appendChild(purple.scope().childNodes[i]);
    }
    purple.scope().appendChild(res.prevView);
    __purple.node = {}
  }
  var treeArr = obj2arr(tree);
  // 遍历更新视图
  for(var i = 0; i<treeArr.length; i++){
    // 判断是否已经存在
    var thisNodeName = treeArr[i][treeArr[i].length - 1];
    if (purple.node(thisNodeName) == null) {
      var thisNode = purple.node(thisNodeName, __purple.template[thisNodeName]);
      // 查找父节点
      if (treeArr[i].length == 1) {
        var parentNode = purple.scope()
      } else {
        var parentNodeName = treeArr[i][treeArr[i].length - 2];
        var parentNode = purple.node(parentNodeName);
      }
      // 查找插口
      var jack = parentNode.querySelector('[data-id="'+thisNodeName+'"]');
      if (jack == null) {jack = parentNode}
      // 插入
      jack.appendChild(thisNode);
      if(isUndefined(animation)){
        thisNode.style.display = null;
      }
    }
  } // 遍历结束
  if(isDefined(animation)){
    animation(prevView, purple.scope())
  }
}


function render3 (node, tree, animation) {

  var oldTree = __purple.tree;
  var oldTreeArr = obj2arr(oldTree);
  if(oldTreeArr.length>0) {
    var prevScope = purple.node(oldTreeArr[0][0]);
    if(typeof animation == 'undefined') {
      prevScope.remove();
    }
    prevScope.id = 'purple-scope-prev';
  } else {
    var prevScope = null
  }


  __purple.node = {};
  var treeArr = obj2arr(tree);
  var newScope = purple.node(treeArr[0][0], purple.template(treeArr[0][0]));

  for(var i=1; i<treeArr.length; i++){
    if(treeArr[i].length==1){
      var parentNode = newScope;
    } else {
      var parentNodeName = treeArr[i][treeArr[i].length - 2]
      var parentNode = purple.node(parentNodeName);
    }
    var thisNodeName = treeArr[i][treeArr[i].length -1]
    var thisNode = purple.node(thisNodeName, purple.template(thisNodeName));
    var jack = parentNode.querySelector('[data-id="'+thisNodeName+'"]');
    if (jack == null) {jack = parentNode}
    jack.appendChild(thisNode);
  }

  __purple.tree = tree;
  if(typeof animation == 'undefined') {
    document.body.appendChild(newScope);
  } else {
    animation(prevScope, newScope)
  }


}






function render2 (node, tree, animation) {
  var oldTree = __purple.tree || {}
  var diff = compareTree(oldTree, tree)
  __purple.tree = tree
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
      // 未加载过的node
      if (isUndefined(__purple.node[nodeName])) {
        if (treeArr[i].length == 1) {
          var parentNode = document.body
        } else {
          var parentNodeName = treeArr[i][treeArr[i].length-2]
          var parentNode = __purple.node[parentNodeName] || {aaa:'aaaa'}
        }

        var jack = parentNode.querySelector('[data-id="'+nodeName+'"]')
        if (jack == null) {jack = parentNode}
        jack.appendChild(purple.node(nodeName, __purple.template[nodeName]))
      }
    }

    return diff
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




/**
 * URL 解析
 * 2014-05-27 13:24:33

 source == origin+pathname+search+hash
 source == origin+relative
 source == protocol+hostname+port+relative

 search即从origin后的第一个?开始，到第一个#号之前
 hash从第一个#开始，一直到结束

 所以先判断hash，将href中的hash成分去除
 再判断search，只要看看还有没有?号即可
 剩下的就是origin+pathname了

 如果origin不是当前的origin，则用location.replace(source)进行跳转。

 */
function parseURL(url) {
  var a =  document.createElement('a');
  a.href = url;


  /**
   * IE下，a.pathname是不显示第一个字符'/'的，
   * 这会导致'/'这种url获取不到真实的pathname（会显示空字符）
   * 所以修正下，手动加上'/'
   */
  var ppx = a.pathname || '/'+ a.pathname

  var result = {
    href: a.href,
    origin: a.origin,
    source: url,
    protocol: a.protocol.replace(':',''),
    hostname: a.hostname,
    port: a.port,
    
    relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1], //  除去origin之外的全部

    // pathname string
    pathname: ppx.replace(/^([^\/])/,'/$1'),

    // pathnames array
    pathnames: arrayClean(a.pathname.replace(/^\//,'').split('/'),''),

    // search string
    search: a.search,

    // searches  key-value
    searches: (function(){
      var ret = {},
        seg = a.search.replace(/^\?/,'').split('&'),
        len = seg.length, i = 0, s;
      for (;i<len;i++) {
        if (!seg[i]) { continue; }
        s = seg[i].split('=');
        ret[s[0]] = s[1];
      }
      return ret;
    })(),

    /**
     * hash字符串+关联数组
     */
    hash: a.hash.replace('#',''),
    hashes: arrayClean(a.hash.replace(/^(#)*/i,'').replace(/^\//,'').split('/'),''),

    file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
  }



  var parsedURL = String();
  parsedURL += '/'+result.pathnames.join('/')



  if(objLength(result.searches)>0){
    parsedURL += String('?');
    for (x in result.searches) {
      parsedURL += x + '='
      parsedURL += ('undefined' != typeof result.searches[x]) ? result.searches[x]: ''
      parsedURL += '&'
    };
    parsedURL = parsedURL.substring(0, parsedURL.length-1)
  }


  if (result.hashes.length>0) {
    parsedURL += '#'
    for (var i = 0; i < result.hashes.length; i++) {
      if (i<result.hashes.length-1) {
        parsedURL += result.hashes[i] + String('/')
      } else {
        parsedURL += result.hashes[i]
      }
    };
  };



  result.parsedURL = parsedURL

  return result
};purple.dom = function(dom){

  if (typeof dom.__enhanced != 'undefined') {
    return dom
  }

  /**
   * 初始化 transform
   */
  var styleTransform = dom.style.transform || dom.style['-webkit-transform'] || dom.style['-moz-transform'];
  var translate3d = {x: 0, y: 0, z: 0 };
  var scale = {x: 1, y: 1};
  var rotate3d = {x: 0, y: 0, z: 0, angle: 0};
  if (styleTransform != null && styleTransform != '') {

    styleTransform = styleTransform.toLowerCase();
    var a = styleTransform.match(/(?:translate3d).+?\)/);
    if (a != null) {
      var a1 = a[0].split(/translate3d/)[1].match(/\d+/g);
      translate3d = {x: Number(a1[0]), y: Number(a1[1]), z: Number(a1[2]) }
    }

    var b = styleTransform.match(/(?:scale).+?\)/);
    if (b != null) {
      var b1 = b[0].split(/scale/)[1].match(/\d+/g);
      scale = {x: Number(b1[0]), y: Number(b1[1])}
    }

    var c = styleTransform.match(/(?:rotate3d).+?\)/);
    if (c != null) {
      var c1 = c[0].split(/rotate3d/)[1].match(/\d+/g);
      rotate3d = {x: Number(c1[0]), y: Number(c1[1]), z: Number(c1[2]) , angle: Number(c1[3])};
    }
  }

  dom.__transform = {
    translate3d: translate3d,
    scale: scale,
    rotate3d: rotate3d
  };

  dom.transform = function (transform) {

    var value = [
      'translate3d(' + transform.translate3d.x + 'px, ' + transform.translate3d.y + 'px, 0)',
      'scale(' + transform.scale.x + ', ' + transform.scale.y + ')',
      'rotate3d('+ transform.rotate3d.x +','+ transform.rotate3d.y +','+ transform.rotate3d.z +','+  transform.rotate3d.angle + 'deg)'
    ];

    value = value.join(" ");
    this.style.webkitTransform = value;
    this.style.mozTransform = value;
    this.style.transform = value;

    this.__transform = transform;
    this.__transform.prev = {
      translate3d: JSON.parse(JSON.stringify(this.__transform.translate3d)),
      scale: JSON.parse(JSON.stringify(this.__transform.scale)),
      rotate3d: JSON.parse(JSON.stringify(this.__transform.rotate3d))
    };

    return this

  };


  dom.__enhanced = true;
  return dom

};;
  return purple


} // END factory

})(this);