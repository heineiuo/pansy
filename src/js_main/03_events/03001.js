purple.addEvent('scrollWindow', function (event) {


  var t = document.body.scrollTop || document.documentElement.scrollTop

  if (t > 0) {
    $('.navbar-wrap').addClass('fix')
  } else {
    $('.navbar-wrap').removeClass('fix')
  }
  
})