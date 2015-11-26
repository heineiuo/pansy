/**
 * 监听浏览器的popstate change
 */
function handlePopState (req, res, next) {

  if (typeof this.disabled != 'undefined') return next()

  this.disabled = true

  if (!__app.conf.spa) return next()

  console.info('监听浏览器popstate状态: 开启')

  window.addEventListener('popstate', function (event){

    if (url(__app.state.curUrl).beforeHash() != url(location.href).beforeHash()){
      // 确认拿到处理权 (→_→ 比隔壁容易多了
      __app.app.go(location.href, 'replace')
    }
    // 交出处理权

  }, false);

  next()
}