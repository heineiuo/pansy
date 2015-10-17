function routeChecker(req, path){


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

    _thisApp.state.prevUrl = _thisApp.state.curUrl
    _thisApp.state.curUrl = req.parsedUrl


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
