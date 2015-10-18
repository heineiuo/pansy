/**
 * 获取被点击a标签的链接
 * @param event
 * @param callback
 */

function anchorClick(req, res, next){

  if (typeof this.disabled != 'undefined') return next()

  this.disabled = true

  if(!__app.conf.spa) return next()

  console.log('开启监听anchor点击')

  document.addEventListener('click', function (event){

    closestHref(event.target, function(err, href){
      console.warn(err)
      if (err) return false
      if (href.substr(0,1) == '#'){
        console.info('HASH_MODE')
      } else {
        event.preventDefault()
        console.info('获取成功,开始跳转')
        __app.app.go(href, 'push')
      }
    })

    /**
     * Find closest anchor href.
     * @param dom
     * @api private
     */
    function closestHref(dom, callback) {
      if (dom == document.body || dom == null) {
        callback('notfound')
      } else {
        if (dom.nodeName == 'A') {
          if (typeof dom.attributes.href == 'undefined') {
            callback('err')
          } else {
            callback(null, dom.attributes.href.value)
          }
        } else {
          closestHref(dom.parentNode, callback)
        }
      }
    }

  }, false)

  next()

}
