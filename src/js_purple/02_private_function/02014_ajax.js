
/**
 * ajax控制中心
 * @author @smilevcard
 * 2014-03-29 16:57:38
 * 
 * 借助于jQuery的ajax模块
 *
 */
function ajax(argument) {

  var url = argument.url || __purple.apipath
  var callback = argument.callback || function () {}
  var data = argument.data || {}
  var type = argument.type || 'POST'
  var dataType = argument.dataType || 'json'

  $.ajax({
    url: url,
    type: type,
    dataType: dataType,
    data: data,
  })
  .done(function (data) {
    if(__purple.debug){
      console.log(data)
    }

    if ('undefined' == typeof data.error) {
      callback(data)
    } else {
      if ('undefined' != typeof argument.error) {
        argument.error(data, function (err) {
          if (err) {
            __purple.ajaxErrorHandle(data)
          }
        })
      } else {
        __purple.ajaxErrorHandle(data)
      }
    }
  })
  .fail(function (jqXHR) {

    if ('undefined' != typeof argument.fail) {
      argument.fail(data, function (err) {
        if (err) {
          __purple.ajaxFailHandle(data)
        }
      })
    } else {
      __purple.ajaxFailHandle(data)
    }

  })

}

/**
 * ajax 返回Error处理
 */
function ajaxErrorHandle(data) {
  if (__purple.debug) {
    console.log(data)
  };

}

/**
 * ajax 服务器无响应处理
 */
function ajaxFailHandle(jqXHR) {
  if (__purple.debug) {
    console.log(jqXHR)
  };

}


