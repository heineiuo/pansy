(function (global) {

  if ( typeof define === "function" && define.amd ) {
      define(['jquery'], function ($) {
        return factory(global, $)
      })
  } else {
      global.purple = factory(global, jQuery)
  }

  function factory(global, $) {