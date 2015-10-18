purple.Controller = function (){

  return function (name, fn){

    var it = this

    if (typeof it.__stack == 'undefined') {
      it.__stack = {}
    }

    var isStackExist = typeof it.__stack[name] != 'undefined'

    if (typeof fn === 'function'){
      if (isStackExist) console.warn('controller has exits, but this new controller will be registered: '+name)
      it.__stack[name] = fn
    } else if (!isStackExist){
      console.warn('controller lost fn param, but it still run: '+name)
      it.__stack[name] = function(req, res, next) {
        next()
      }
    }

    return it.__stack[name]

  }

}
