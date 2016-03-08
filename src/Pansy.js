/**
 * Entry file.
 */

var url = require('./url')
var Router = require('./Router')
var createApp = require('./createApp')

var pansy = {
  __hasInit: false,
  __mainAppInit: false,
  __hasPlugins: false,
  __mainApp: {},
  __pluginApps: {},
  __onpopstate: false,
  __onanchorclick: false,
  createMain: function(conf){
    init()
    if (this.__mainAppInit) return this.__mainApp
    pansy.__mainAppInit = true
    return this.__mainApp = createApp(conf)
  },
  createPlugin: function(conf){
    init()
    this.__hasPlugins = true
    if (typeof this.__pluginApps[conf.pluginName] != 'undefined') {
      return this.__pluginApps[conf.pluginName]
    }
    conf.isPlugin = true
    this.__pluginApps[conf.pluginName] = createApp(conf)
    return this.__pluginApps[conf.pluginName]
  }
}

// alias
pansy.Plugin = pansy.createPlugin
pansy.Main = pansy.Master = pansy.createMain
pansy.Router = pansy.Router = Router


function init() {
  if (pansy.__hasInit) return false
  pansy.__hasInit = true
  if(typeof window.onpopstate != 'undefined') {
    window.addEventListener('popstate', popstateHandle, false)
  }

  if (typeof document.addEventListener != 'undefined') {
    document.addEventListener('click', anchorClickHandle, false)
  } else if (typeof document.attachEvent != 'undefined') {
    document.attachEvent('onclick', anchorClickHandle)
  } else {
    document.onclick = anchorClickHandle;
  }
}

function popstateHandle(event) {
  if (pansy.__mainAppInit) {
    var app = pansy.__mainApp
    if (app.state.spa) {
      console.log('popstateHandle handling....')
      console.log(app.state.curUrl, location.href)

      // todo
      // plugin app's route do not change location.href
      // so it will be not need to check hash here.
      return app.go(location.href, 'replace')

      if (url(app.state.curUrl).beforeHash() != url(location.href).beforeHash()){
        console.log('popstateHandle get right, and run app.go(location.href)')
        app.go(location.href, 'replace')
      } else {
        console.log('popstateHandle give up handle function')
      }
    }
  }
}

function anchorClickHandle (event) {
  if (pansy.__mainAppInit) {
    if (pansy.__mainApp.state.spa){
      closestHref(event.target)
    }
  } else if (pansy.__hasPlugins){
    closestHref(event.target)
  }

  /**
   * Find closest anchor href.
   * @param dom
   * @api private
   */
  function closestHref(dom) {
    if (dom != document.body && dom != null) {
      if (dom.nodeName == 'A') {
        if (typeof dom.attributes.href != 'undefined') {
          // 处理链接
          var value = dom.attributes.href.value
          hrefHandle(value)
          hashHandle(value)
        }
        // 递归结束, 交出处理权
      } else {
        closestHref(dom.parentNode)
      }
    }
    // 结束递归, 交出处理权
  }

  function hrefHandle(value) {
    if (value.substr(0,1) != '#') {
      // 不是以#开头的, 判断链接是否一样
      // 如果链接一样, 判断是不是文件协议开头的,如果是,直接获取处理权!!!
      // 如果不是, 阻止页面刷新!!!
      // (所以只要链接一样, 肯定阻止跳转事件发生)
      // 如果链接不一样, 判断是不是因为hash的缘故,
      // 如果是因为hash不一样,判断是不是新链接没有hash,
      // 如果是hash清空了, 为了防止浏览器默认的刷新处理, 阻止刷新事件!!!
      // 如果不是因为hash,而是url真的变了, 判断是不是要跳转到外站(第三方站点)
      // 如果不是,那就拿到处理权,开始处理
      // 如果是的,那就继续处理
      if (url(location.href).href == url(value).href) {
        getRight(value)
      } else if(url(location.href).beforeHash() == url(value).beforeHash()) {
        if (url(value).hash == '') {
          event.preventDefault()
          console.log('为了防止浏览器默认的刷新处理')
        }
      } else if (url(location.href).origin() == url(value).origin()) {
        getRight(value)
      }
    }
  }

  /**
   * 凡是hash发生变化的清空,都单独处理
   * @param value
   */
  function hashHandle(value){
    var hash = url(value).hash
    if (url(value).hash != '') {
      var hashes = hash.split('/')
      if (hashes.length>1) {
        if (typeof pansy.__pluginApps[hashes[1]] != 'undefined'){
          event.preventDefault()
          pansy.__pluginApps[hashes[1]].go(value, 'replace')
        }
      }
    }
  }

  // 拿到处理权,并跳转
  function getRight(value){
    event.preventDefault()
    console.info('开始解析:' + value)
    pansy.__mainApp.go(value, 'push')
  }

}



/**
 * 判断请求的url应该使用哪个app
 */
function checkApp(url){
  // todo
}


module.exports = pansy