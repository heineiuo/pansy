

/**
 * private
 */
var __purple = {
  template: {}, // html模板 string类型
  dom: {}, // dom 对象
  mainApp: null,
  apps: {
    __anonymous: {}
  },
  conf: {
    scope: '/'
  }
}

function purple (name) {

  if (arguments.length === 0 ) {
    if (__purple.mainApp !== null) {
      return __purple.apps[__purple.mainApp]
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
          location.href = href
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
          console.log(app.list[href])

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

  console.log('系统启动...')
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
    purple.getMainapp().go(href)
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