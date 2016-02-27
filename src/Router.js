var map = require('./map')

function Router(){
  var __stack = []
  return {
    __stack: __stack,
    use: function(fn){
      __stack.push(fn)
    },
    route: function(path){
      return {
        get: function(){
          var fns = Array.prototype.slice.call(arguments,0)
          map(fns, function(item, index){
            __stack.push([path, item])
          })
        }
      }
    }
  }
}

module.exports = Router