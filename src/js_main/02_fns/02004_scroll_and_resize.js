
function a (arg) {

  var classPre = 'width-'
  var keyPixel  = arg.keyPixel  || [400, 600, 800]
  var rangeName = arg.rangeName || ['min', 'medium', 'big', 'max']
  var w = window.innerWidth
  var classNames = []
  for (var i = 0; i < rangeName.length; i++) {
    classNames.push(classPre+rangeName[i])
  }
  var className = classNames.join(' ')


  setWidth(w)
  
  window.onresize = function (event) {
    if (w != window.innerWidth) { setWidth(w) }
  }

  function setWidth (w) {
    w = window.innerWidth
    $('body').attr('data-width', w)
    var n = rangeName[range(w, keyPixel, 0)]
    $('body').removeClass(className).addClass(classPre+n)
  }

  function range (w, array, i) {
    if (i == array.length) {
      return i
    } else if (w < array[i]) {
      return i
    } else {
      i ++
      return range(w, array, i)
    }
  }
}