/**
 * URL解析
 */

function url(val){

  var a =  document.createElement('a');
  a.href = val;

  return {
    rawUrl: a.href,
    href: a.href,
    hash: a.hash,
    port: a.port,
    protocol: a.protocol,
    // functions
    pathname: pathname,
    //params: params,
    query: query,
    origin: origin,
    beforeHash: beforeHash,

    all: function(){
      return {
        rawUrl: a.href,
        port: a.port,
        protocol: a.protocol,
        hostname: a.hostname,
        pathname: pathname(),
        //params: params(),
        query: query(),
        origin: origin()
      }
    }
  }

  function beforeHash(){
    return a.href.replace(/#.*/, '')
  }

  function pathname(){
    var ppx = a.pathname || '/'+ a.pathname; // fix IE bug.
    return ppx.replace(/^([^\/])/,'/$1')
  }

  //function params(){
  //  return clean(a.pathname.replace(/^\//,'').split('/'),'')
  //}

  function query(){
    var ret = {}
    var seg = a.search.replace(/^\?/,'').split('&')
    var len = seg.length
    for (var i=0; i<len; i++) {
      if (!seg[i]) continue
      var s = seg[i].split('=')
      ret[s[0]] = s[1]
    }
    return ret
  }

  function origin() {
    if (typeof a.origin != 'undefined') return a.origin
    // fix IE bug.
    var origin = a.protocol + '//' + a.hostname
    if (a.port == '') return origin
    if (a.port == '80' && a.protocol == 'http:') return origin
    if (a.port == '443' && a.protocol == 'https') return origin
    origin += ':'+ a.port
    return origin
  }

}

module.exports = url