function purple (name) {

  if (arguments.length === 0 ) {
    if (__purple.mainApp !== null) {
      return __purple.apps[__purple.mainApp]
    } else {
      return __purple.apps.__anonymous
    }
  } else {
    if (typeof __purple.apps[name] != 'undefined') {
      return __purple.apps[name]
    } else {
      return newApp(name)
    }
  }

  function newApp (name) {
    var app = __purple.apps[name] = {
      name: name,
      set: function(conf){

      },
      get: function(){

      },
      go: function(href){


      },
      back: function(){
        // 后退一步
      },
      route: function(href){
        var router = {
          get: function(arr){
            var _len = arr.length

          }
        }
        return router
      }
    }

    return app
  }

}

purple.start = function(){

}

