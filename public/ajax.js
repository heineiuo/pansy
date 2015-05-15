function ajax (arg) {

  var url = arg.url || __purple.apipath
  var callback = arg.callback || function () {}
  var data = arg.data || {}
  var type = arg.type || 'POST'
  var dataType = arg.dataType || 'json'

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
      if ('undefined' != typeof arg.error) {
        arg.error(data, function (err) {
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

    if ('undefined' != typeof arg.fail) {
      arg.fail(data, function (err) {
        if (err) {
          __purple.ajaxFailHandle(data)
        }
      })
    } else {
      __purple.ajaxFailHandle(data)
    }

  })

    
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


}

