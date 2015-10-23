purple.Controller = function (){

  var __stack = {}

  return function (name, fn){

    var isStackExist = typeof __stack[name] != 'undefined'

    if (typeof fn === 'function'){
      if (isStackExist) console.warn('controller has exits, but this new controller will be registered: '+name)
      __stack[name] = fn
    } else if (!isStackExist){
      console.warn('controller lost fn param, but it still run: '+name)
      __stack[name] = function(req, res, next) {
        next()
      }
    }

    return __stack[name]

  }

}