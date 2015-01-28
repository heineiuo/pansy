
  var purple = window.purple = {


    init: function (arguments) {
      init(arguments)
    },

    machine: function (arguments) {
      newMachine(arguments)
    },

    newMachine: function (arguments) {
      newMachine(arguments)
    },

    html: function (name,frag) {
      return html(name,frag)
    },

    on: function (arguments) {
      observerOn(arguments)
    },

    off: function (arguments) {
      observerOff(arguments)
    },

    router: function (arguments) {
      router(arguments)
    },

    route: function (arguments) {
      router(arguments)
    },
    
    define: function(arguments){
      define(arguments)
    },

    progress: function(arguments) {
      if ( __purple.progressShow ) {
        progressHandle(arguments)
      }
    },

    parseURL: function (argument) {
      return parseURL(argument)
    },

  /******************/



    getConfig: function () {
      return __purple.config
    },



  /**********************/


    add: function (methodName, fn) {

      if ('undefined' == typeof __purple.fn[methodName]) {
        __purple.fn[methodName] = fn
      } else {
        // console.log('some method has been added');
      }
      
    },

    set: function (methodName, fn) {

      if ('undefined' == typeof __purple.fn[methodName]) {
        __purple.fn[methodName] = fn
      } else {
        // console.log('some method has been added');
      }

    },

    get: function (methodName) {
      return __purple.fn[methodName]
    },


    addEvent:  function (eventName, fn) {
      if ('undefined' == typeof __purple.events[eventName]) {
        __purple.events[eventName] = fn
      } else {
        // console.log('some event method has been added');
      }
    },

    getEvent: function (eventName) {
      return __purple.events[eventName]
    },


    ajax: function (arguments) {
      ajax(arguments)
    },


    /********************/

    setCookie: setCookie,
    getCookie: getCookie,
    removeCookie: removeCookie


  }

  

} // END factory