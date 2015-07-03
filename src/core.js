/**
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

  function findorCreateApp(argu) {
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
    prevUrl: null,
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

      if (rawHref instanceof Array) {
        href = new RegExp('(^'+rawHref.join('$)|(^')+'$)')
      } else if (typeof rawHref == 'string') {
        href = new RegExp('^'+rawHref+'$')
      } else if (rawHref instanceof RegExp){
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

      var _thisApp = this;

      if (!_thisApp.state.complete) {
        return false;
      }

      _thisApp.state.complete = false;

      var req = extend(parseurl(href), {
        prevUrl: _thisApp.state.curUrl,
        rawUrl: href, // 原始请求连接
        historyStateType: type || 'push' // 堆栈方式
      });

      var res = {

        end: function () {
          clearTimeout(t)
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
      var t = setTimeout(function(){
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

          if (typeof _thisApp.conf.filter.search != 'undefined'){
            console.log('路由模式切换为使用searches参数:'+_thisApp.conf.filter.search)

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
          } else {
            routePath = req.pathname.substr(Object(mathResult[0]).length)
          }

        } else {
          console.warn('routePath不符合pathname过滤规则，浏览器重定向到请求网址')
          location.replace(req.rawUrl)
        }

        console.log('过滤后的routePath: '+routePath)

        _thisApp.state.prevUrl = _thisApp.state.curUrl
        _thisApp.state.curUrl = req.parsedUrl

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
    //window.addEventListener('hashchange', hashChangeHandle, false);
    window.addEventListener('popstate', popstateHandle, false);
    document.addEventListener('click', anchorClickHandle, false);
  } else if (!conf.spa && state.spa){
    state.spa = false
    //window.removeEventListener('hashchange', hashChangeHandle, false);
    window.removeEventListener('popstate', popstateHandle, false);
    document.removeEventListener('click', anchorClickHandle, false);
  }

  return state;

  function hashChangeHandle(){
    console.log('hashChangeHandle')
  }

  function popstateHandle(event){
    console.log('popstateHandle')
    checkPopChange(function(err){
      if (err) {
        //console.log(err)
      } else {
        purple(conf.name).go(location.href)
      }
    })
  }

  function anchorClickHandle(event){
    getAnchorHref(event, function(err, href){
      if (err) {
        //console.log(err)
      } else {
        purple(conf.name).go(href)
      }
    })
  }

  function checkPopChange(callback){
    var curUrl = purple(conf.name).state.curUrl
    var newUrl = location.href

    var curUrlParsed = parseurl(curUrl)
    var newUrlParsed = parseurl(newUrl)

    if (curUrlParsed.pathname == newUrlParsed.pathname && curUrlParsed.search == newUrlParsed.search) {
      callback('HASH_CHNAGED')
    } else {
      callback(null)
    }
  }


  /**
   * 获取被点击a标签的链接
   * @param event
   * @param callback
   */
  function getAnchorHref(event, callback){

    var href = null;

    r(event.target);

    //console.log('getAnchorHref: '+href)

    if (href == null) {
      callback('HREF_NOT_FOUND')
    } else if (href.substr(0,1) == '#'){
      callback('HASH_MODE')
    } else {
      event.preventDefault();
      callback(null, href)
    }

    /**
     * Find closest anchor href.
     * @param dom
     * @api private
     */
    function r(dom) {
      if (dom != document.body && dom != null) {
        if (dom.nodeName == 'A') {
          if (typeof dom.attributes.href == 'undefined'){
            href = null
          } else {
            href = dom.attributes.href.value
          }
        } else {
          r(dom.parentNode)
        }
      }
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