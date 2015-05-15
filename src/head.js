(function (global) {

  if ( typeof define === "function" && define.amd ) {
    define(function () {
      return factory(global)
    })
  } else {
    global.purple = factory(global)
  }

  function factory(global) {
