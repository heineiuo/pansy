/**
 * 获取被点击a标签的链接
 * @param event
 * @param callback
 */

function anchor(req, res, next){

  if (typeof this.disabled != 'undefined'){
    next()
  }

  this.disabled = true

  document.addEventListener('click', anchorClickHandle, false);

  function anchorClickHandle(event){
    getAnchorHref(event, function(err, href){
      if (err) {
        //console.log(err)
      } else {
        purple(conf.name).go(href)
      }
    })
  }

  function getAnchorHref(event, callback){

    var href = null;

    r(event.target);

    //console.log('getAnchorHref: '+href)

    if (href == null) {
      callback('HREF_NOT_FOUND')
    } else if (href.substr(0,1) == '#'){
      callback('HASH_MODE')
    } else {
      event.preventDefault();
      callback(null, href)
    }

    /**
     * Find closest anchor href.
     * @param dom
     * @api private
     */
    function r(dom) {
      if (dom != document.body && dom != null) {
        if (dom.nodeName == 'A') {
          if (typeof dom.attributes.href == 'undefined'){
            href = null
          } else {
            href = dom.attributes.href.value
          }
        } else {
          r(dom.parentNode)
        }
      }
    }


  }

}
