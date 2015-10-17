

function popstate(req, res, next) {

  if (typeof this.isstarted != 'undefined'){
    next()
  }

  this.isstarted = true

  window.addEventListener('popstate', popstateHandle, false);

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

  function checkPopChange(callback){
    var curUrl = purple().state.curUrl
    var newUrl = location.href

    var curUrlParsed = parseurl(curUrl)
    var newUrlParsed = parseurl(newUrl)

    if (curUrlParsed.pathname == newUrlParsed.pathname && curUrlParsed.search == newUrlParsed.search) {
      callback('HASH_CHNAGED')
    } else {
      callback(null)
    }
  }

}
