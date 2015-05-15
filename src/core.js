

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
    scope: '/'
  }
}

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
          end: function () {
            req._end = true
            console.log('路由跳转完毕...')
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
      },

      render: function(tree, animation) {
        render(document.body, tree, animation)
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

purple.start = function() {


  document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      var _len = document.scripts
      for (var i = 0; i < _len.length; i++) {
        var s = document.scripts[i]
        if (s.type === 'text/template') {
          __purple.template[s.attributes.getNamedItem('data-name').value] = s.innerText
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

  }

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

