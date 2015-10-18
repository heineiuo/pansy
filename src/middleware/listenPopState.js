/**
 * 监听浏览器的popstate change
 */
function popstateChange(req, res, next) {

  if (typeof this.disabled != 'undefined') return next()

  this.disabled = true

  if (!__app.conf.spa) return next()

  console.log('开启监听浏览器popstate状态')

  window.addEventListener('popstate', function (event){

    var curUrl = __app.state.curUrl
    var newUrl = location.href
    var curUrlParsed = parseurl(curUrl)
    var newUrlParsed = parseurl(newUrl)

    if (curUrlParsed.pathname == newUrlParsed.pathname && curUrlParsed.search == newUrlParsed.search) {
      console.log('HASH_CHNAGED')
    } else {
      __app.app.go(location.href)
    }

  }, false);

  next()
}
