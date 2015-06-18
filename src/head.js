(function (global) {

  if ( typeof define === "function" && define.amd ) {
    define(function () {
      return factory()
    })
  } else {
    global.purple = factory()
  }

  function factory() {
