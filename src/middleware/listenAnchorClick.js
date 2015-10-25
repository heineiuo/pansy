/**
 * 获取被点击a标签的链接
 * @param event
 * @param callback
 */

function anchorClick(req, res, next){

  if (typeof this.disabled != 'undefined') return next()

  this.disabled = true
  if(!__app.conf.spa) return next()

  console.info('监听anchor点击: 开启')

  document.addEventListener('click', function (event){
    closestHref(event.target)
    /**
     * Find closest anchor href.
     * @param dom
     * @api private
     */
    function closestHref(dom) {
      if (dom != document.body && dom != null) {
        if (dom.nodeName == 'A') {
          if (typeof dom.attributes.href != 'undefined') {
            hrefHandle(dom.attributes.href.value)
          }
          // 交出处理权
        } else {
          closestHref(dom.parentNode)
        }
      }
      // 结束递归, 交出处理权
    }

    function hrefHandle(value) {
      if (value.substr(0,1) != '#') {
        if (url(location.href).href == url(value).href) {
          // 拿到处理权,但url相同, 不跳转
          event.preventDefault()
          console.info('相同url默认无操作,如有特殊需求请手动app.go()')
        } else if( url(location.href).origin() == url(value).origin() &&
          url(location.href).beforeHash() != url(value).beforeHash()) {
          // 拿到处理权,并跳转
          event.preventDefault()
          console.info('开始解析:' + value)
          __app.app.go(value, 'push')
        }
      }

    }

  }, false)

  next()

}