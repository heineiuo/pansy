/**
 * @public html加载器
 * 根据jackname获取html片段
 * 2014-03-31 19:52:20
 */
function html(name, frag) {

  if ( 'undefined' != typeof frag ) { // 将字符串载入__purple.html

    __purple.html[name] = handleFrag(frag)

  } else if ( !isDefined(__purple.html[name])) { // 服务器获取

    $.ajax({
      url: __purple.htmlpath + '/' + name + '.html',
      type: 'GET',
      dataType: 'html',
      async: false
    })
    .done(function (frag) {

      __purple.html[name] = handleFrag(frag)

    })
    .fail(function (jqXHR) {
      // 重大错误
      if(__purple.debug) {
        console.log(jqXHR)
      }
    })
  }

  // 缓存中已存在

  return __purple.html[name];


  function handleFrag (frag) {
    var wrap = document.createElement('div');
    wrap.innerHTML = frag
    wrap = (wrap.childNodes.length == 1)?wrap.childNodes[0]:wrap
    return wrap
  }
}



function jack(jackname, frag) {

  if (!__purple.jacks[jackname].ready) {

    if ('undefined' == typeof frag) {
      html(jackname)
    } else {
      html(jackname, frag)
    }
    
    clearDataJack(jackname)
    __purple.jacks[jackname]['ready'] = true

  }

  return __purple.html[jackname]


  function clearDataJack (jackname) {

    /**
     * 清理data-jack节点， 给他们加上id
     */
    var $datajacks = $(__purple.html[jackname]).find('[data-jack]')
    for (var i = 0; i < $datajacks.length; i++) {

      var $item = $datajacks.eq(i)

      var itemJackname = $item.attr('data-jack')

      if ('undefined' == typeof __purple.jacks[itemJackname]) {
        __purple.jack_id ++
        __purple.jacks[itemJackname] = {
          id: 'ppjack' + String(__purple.jack_id),
          ready: false
        }
      }

      if ('string' == typeof $item.attr('id')) { // 如果自带id，使用自带id
        __purple.jacks[itemJackname]['id'] = $item.attr('id')
      }

      $item.attr('id', __purple.jacks[itemJackname]['id'])

      if (!__purple.debug) { // 如果是生成模式，dom中不暴露data-jack
        $item.attr('data-jack', null)
      };


    }


    /**
     * 清理 id
     */
    if (__purple.html[jackname].id != '') {
      __purple.jacks[jackname]['id'] = __purple.html[jackname].id
    } else {
      __purple.html[jackname].id = __purple.jacks[jackname]['id']
    }


    return __purple.html[jackname]

  }

}
