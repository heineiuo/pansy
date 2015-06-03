/**
 * __purple
 * @api private
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
    scope: 'body',
    scopeDOM: null,
    templateSource: 'script',
    filter: '/'
  }
};


/**
 * Create or return an App.
 *
 * @param {string} name
 * @returns {*}
 */
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

  /**
   * @param {string} name
   * @returns {Object} app
   * @api private
   *
   */
  function newApp (name) {

    var app = __purple.app[name] = {

      name: name,

      // 中间件
      middleware: [],

      // 路由集合
      list: {},

      // 配置
      conf: {

      },

      /**
       * current url.
       */
      currentHref: null,

      /**
       * prev url.
       */
      prevHref: null,

      /**
       * Set app config.
       */
      set: function(name, conf){
          this.conf[name] = conf
      },

      /**
       * Get app config.
       * @param {string} name
       * @return {string|object}
       */
      get: function(name){
        return this.conf[name]
      },

      /**
       * Add middleware for app.
       * @param {function} fn
       * @api public
       */
      use: function (fn) {
        app.middleware.push(fn)
      },

      /**
       * Core method. Change the route state.
       * @param {string} href
       * @param {string} type
       * @api public
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

          isFirstRender: true,

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
        };

        // 使用中间件
        var fns = [findRoute].concat(app.middleware)
        next();

        /**
         * 查找路由器
         */
        function findRoute(req, res, next) {
          if (req.historyStateType == 'replace') {
            history.replaceState('data', 'title', req.parsedURL)
          } else {
            history.pushState('data', 'title', req.parsedURL)
          }
          console.log('正在解析地址：'+req.rawUrl)

          // 判断href是否合法
          // 判断href是否在list中
          for(key in app.list) {
            if (app.list[key].regexp.test(req.pathname)) {
              console.log('解析路由成功：'+app.list[key].regexp)
              fns = fns.concat(app.list[key].fns)
              return next()
            }
          }

          console.warn('无法解析的地址：' + req.pathname)
          // todo res.status = 404， 重构fns，插入renderError
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

      /**
       * History back.
       */
      back: function(){
        // 后退一步
        history.back()
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

/**
 * Return dom string.
 *
 * @param {string} name
 * @returns {string}
 */
purple.template = function(name){
  return __purple.template[name] || '<div></div>';
};


/**
 * Set config for __purple.conf
 * @param {string} name
 * @param {string|object} conf
 * @api public
 */
purple.set = function(name, conf){
  __purple.conf[name] = conf
};

/**
 * Get config from __purple.conf
 * @param name
 * @returns {*}
 */
purple.get = function(name){
  return __purple.conf[name]
};

/**
 * Where to create DOMs.
 * @returns {string}
 */
purple.scope = function(){
  return __purple.conf.scope
}

/**
 * @api public
 */
purple.start = function() {
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

  /**
   * Start.
   *
   * @api private
   */
  function start(){
    /**
     * Read template form document.scripts[type="template"].
     */
    if (__purple.conf.templateSource == 'script') {

      var _len = document.scripts.length;
      for (var i = _len-1; i > -1; i--) {
        var s = document.scripts[i];
        if (s.type === 'text/template') {
          __purple.template[s.attributes.getNamedItem('data-name').value] = s.innerText
          s.remove()
        }
      }

    }


    console.log('系统启动成功...')

    purple().go(location.href)
    console.log('初始页加载成功...')

    window.addEventListener('popstate', eventPopstate, false)
    console.log('正在监听URL变化...')

    document.addEventListener('click', eventClickAnchor, false)
    console.log('正在监听链接点击...')

  }

  /**
   * Event handle for popstate changed.
   * @api private
   */
  function eventPopstate(){
    var href = location.href
    purple().go(href, 'replace')
  }

  /**
   * Event handle for click tag `A`.
   * @param {object} event
   * @api private
   */
  function eventClickAnchor(event) {
    var href = findClosestAnchorHref(event.target)
    if (href !== null) {
      event.preventDefault()
      purple().go(href)
    }

    /**
     * Find closest anchor href.
     * @param dom
     * @returns {dom}
     * @api private
     */
    function findClosestAnchorHref(dom) {
      var href = null;
      r(dom);
      return href;

      /**
       * R.
       * @param dom
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

  }

};

