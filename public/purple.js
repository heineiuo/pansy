/*! PURPLE.js v0.6.0-SNAPSHOT 2015-06-24 */
(function (global) {

  if ( typeof define === "function" && define.amd ) {
    define(function () {
      return factory()
    })
  } else {
    global.purple = factory()
  }

  function factory() {
;/**
 * __purple
 * @api private
 */
var __purple = {
  app: {}
};

/**
 * Create or return an App.
 *
 * @param arg
 * @returns {*}
 */
function purple (arg) {
  if (typeof arg == 'undefined') {
    return findorCreateApp({name: '__anonymous'})
  }

  if (typeof arg == 'string') {
    return findorCreateApp({name: arg})
  }

  if (typeof arg == 'object') {
    return findorCreateApp(extend({name: '__anonymous'}, arg))
  }

  function findorCreateApp(argu){
    if (typeof __purple.app[argu.name] == 'undefined'){
      return createApp(argu)
    } else {
      return __purple.app[argu.name]
    }
  }
}



/**
 * @param {object} arg
 * @returns {Object} app
 * @api private
 *
 */
function createApp (arg) {

  console.log('正在创建app:'+arg.name)

  var conf = extend({
    filter: {
      //pathname: '',
      //search: ''
    },
    spa: false,
    timeout: 45000,
    exceptionHandler: function(err, req, res, next){
      if (!err){
        next()
      } else {
        console.error(err)
        res.end()
      }
    },
    notFoundHandle: function(req, res){
      // todo 404
      res.end()
    }
  }, arg);

  var state = updateStateByConf({
    spa: false,
    complete: true,
    prevUrl: '',
    curUrl: location.href
  }, conf);

  __purple.app[arg.name] = {

    // 配置
    conf: conf,

    // 状态
    state: state,

    // 中间件
    middleware: [],

    // 路由集合
    list: {},

    /**
     * Set app config.
     */
    set: function(name, conf) {
      var _thisApp = this;
      var _conf = extend({}, _thisApp.conf); // clone

      if (typeof name == 'object') {
        _conf = extend(_conf, name)
      } else {
        _conf[name] = conf;
      }

      // 禁止修改name
      _conf.name = _thisApp.conf.name;
      // 更新state
      _thisApp.state = updateStateByConf(state, _conf);
      // 更新conf
      _thisApp.conf = _conf;
    },

    /**
     * Add middleware for app.
     * @param {function} fn
     * @api public
     */
    use: function (fn) {
      this.middleware.push(fn)
    },

    /**
     * Define a router and output a `get` method.
     *
     * @param {string|regex|Array} rawHref
     * @returns {object}
     * @api public
     */
    route: function(rawHref) {
      // 判断href是否合法
      var href;
      var _thisApp = this;

      if (isArray(rawHref)) {
        href = new RegExp('(^'+rawHref.join('$)|(^')+'$)')
      } else if (isString(rawHref)) {
        href = new RegExp('^'+rawHref+'$')
      } else if (isRegExp(rawHref)){
        href = rawHref
      } else {
        // todo error handle
        return false
      }

      _thisApp.list[href] = {
        regexp: href,
        get: function () {
          this.fns = Array.prototype.slice.call(arguments,0)
        }
      };

      return _thisApp.list[href]
    },

    /**
     * Core method. Change the route state.
     * @param {string} href
     * @param {string} type
     * @api public
     */
    go: function(href, type){

      if (href == null){
        console.warn('app.go不接受null参数')
        return false;
      }

      var _thisApp = this;

      if (!_thisApp.state.complete) {
        return false;
      }

      _thisApp.state.complete = false;

      var req = extend(parseurl(href), {
        rawUrl: href, // 原始请求连接
        historyStateType: type || 'push' // 堆栈方式
      });

      var res = {

        end: function () {
          _thisApp.state.complete = true;
          console.log('路由跳转完毕。');
        },

        redirect: function(href){
          this.end();
          _thisApp.go(href);
        }
      };


      // 使用中间件
      var flow = [findRoute].concat(_thisApp.middleware)

      // 超时处理
      setTimeout(function(){
        console.warn('超时')
        res.end()
      }, _thisApp.conf.timeout)

      /**
       * 开始执行
       */
      next();

      function next (err) {
        if(typeof err != 'undefined' && err != null){
          _thisApp.conf.exceptionHandler(err, req, res, next)
        } else if (!_thisApp.state.complete) {
          if (flow.length > 0) {
            flow.shift()(req, res, next)
          } else {
            res.end()
          }
        }
      }

      /**
       * 查找路由器
       */
      function findRoute(req, res, next) {
        console.log('正在解析地址：'+req.rawUrl);

        /**
         * 不在filter范围内，跳转页面。
         */
        var routePath = req.parsedUrl
        var notfound = true
        var mathResult = routePath.match(_thisApp.conf.filter.pathname)
        if (mathResult){
          routePath = routePath.substr(Object(mathResult[0]).length)
        } else {
          console.warn('routePath不符合pathname过滤规则，浏览器重定向到请求网址')
          location.replace(req.rawUrl)
        }

        if (typeof _thisApp.conf.filter.search != 'undefined'){
          /**
           * 开启使用参数模式做跳转
           * 使用search做路由的前提是要满足pathname过滤规则
           */
          var search = _thisApp.conf.filter.search
          if (typeof req.searches[search] != 'undefined' && req.searches[search] != ''){
            routePath = req.searches[search]
          } else {
            routePath = '/'
          }
        }

        console.log('过滤后的routePath: '+routePath)

        if (_thisApp.state.spa){
          if (req.historyStateType == 'replace') {
            history.replaceState('data', 'title', req.parsedURL)
          } else  {
            history.pushState('data', 'title', req.parsedURL)
          }
        }


        // 判断href是否合法
        // 判断href是否在list中
        for(var key in _thisApp.list) {
          if (_thisApp.list.hasOwnProperty(key)) {
            if (_thisApp.list[key].regexp.test(routePath)) {
              console.log('解析路由成功：'+_thisApp.list[key].regexp);
              flow = flow.concat(_thisApp.middleware, _thisApp.list[key].fns);
              notfound = false
              return next()
            }
          }
        }

        if (notfound){
          console.warn('该地址无法解析：' + req.rawUrl);
          _thisApp.conf.notFoundHandle(req, res);
        }

      }

    }

  };



  return __purple.app[arg.name]
}

/**
 * 更新app状态
 * @param state
 * @param conf
 */
function updateStateByConf(state, conf){

  if (conf.spa && !state.spa){
    state.spa = true
    window.addEventListener('popstate', popstateHandle, false);
    document.addEventListener('click', anchorclickHandle, false);
  } else if (!conf.spa && state.spa){
    state.spa = false
    window.removeEventListener('popstate', popstateHandle, false);
    document.removeEventListener('click', anchorclickHandle, false);
  }

  return state;

  function popstateHandle(){
    purple(conf.name).go(location.href)
  }

  function anchorclickHandle(event){
    purple(conf.name).go(getanchorhref(event))
  }

}

/**
 * 获取被点击a标签的链接
 * @param event
 * @returns href
 */
function getanchorhref(event){

  // onanchorclick
  var href = null;
  r(event.target);
  if (href !== null) {
    event.preventDefault();
  }

  return href

  /**
   * Find closest anchor href.
   * @param dom
   * @api private
   */
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
function parseurl(url) {
  var a =  document.createElement('a');
  a.href = url;


  /**
   * IE下，a.pathname是不显示第一个字符'/'的，
   * 这会导致'/'这种url获取不到真实的pathname（会显示空字符）
   * 所以修正下，手动加上'/'
   */
  var ppx = a.pathname || '/'+ a.pathname;

  var result = {
    rawUrl: a.href,
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
    pathnames: clean(a.pathname.replace(/^\//,'').split('/'),''),

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
    hashes: clean(a.hash.replace(/^(#)*/i,'').replace(/^\//,'').split('/'),''),

    file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1]
  };



  var parsedURL = '/' + result.pathnames.join('/');


  if(!isEmpty(result.searches)){
    parsedURL += String('?');
    for (var x in result.searches) {
      if (result.searches.hasOwnProperty(x)){
        parsedURL += x + '=';
        parsedURL += ('undefined' != typeof result.searches[x]) ? result.searches[x]: '';
        parsedURL += '&'
      }
    }
    parsedURL = parsedURL.substring(0, parsedURL.length-1)
  }


  if (result.hashes.length>0) {
    parsedURL += '#';
    for (var i = 0; i < result.hashes.length; i++) {
      if (i<result.hashes.length-1) {
        parsedURL += result.hashes[i] + String('/')
      } else {
        parsedURL += result.hashes[i]
      }
    }
  }


  result.parsedURL = parsedURL;
  result.parsedUrl = parsedURL;

  return result
}

;function isDefined(arg) {
  return typeof arg != 'undefined'
}

function isString(arg) {
  return typeof arg == 'string'
}

function isArray(arg) {
  return arg instanceof Array
}

function isRegExp(arg) {
  return arg instanceof RegExp
}

function isEmpty(obj) {
  for(var prop in obj) {
    if(obj.hasOwnProperty(prop))
      return false;
  }
  return true;
}

function map(obj, callback) {
  var result = {};
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (typeof callback === 'function') {
        result[key] = callback.call(obj, obj[key], key, obj);
      }
    }
  }
  return result;
}

function indexOf(arr, value, fromIndex) {
  return arr.indexOf(value, fromIndex)
}

/**
 * Extend multi objects.
 * @returns {object}
 */
function extend() {
  var result = {};
  var objs = Array.prototype.slice.call(arguments,0);
  objs.forEach(function(props, index){
    for(var prop in props) {
      if(props.hasOwnProperty(prop)) {
        result[prop] = props[prop]
      }
    }
  });
  return result;
}


/**
 * Ready? start!
 * @api public
 */
function ready(start) {
  /**
   * Start after document loaded.
   */
  if (document.readyState == "complete"){
    start();
  } else {
    document.onreadystatechange = function () {
      if (document.readyState == "complete") {
        document.onreadystatechange = null;
        start();
      }
    };
  }
}


/**
 * Clean.
 * @param arr
 * @param del
 * @returns {Array}
 */
function clean(arr, del) {
  var result = [];
  arr.forEach(function(value){
    if (value !== del){
      result.push(value)
    }
  });
  return result;
}
;
  return purple;


} // END factory

})(this);