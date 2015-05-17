purple.dom = function(dom){

  if (typeof dom.__enhanced != 'undefined') {
    return dom
  }

  /**
   * 初始化 transform
   */
  var styleTransform = dom.style.transform || dom.style['-webkit-transform'] || dom.style['-moz-transform'];
  var translate3d = {x: 0, y: 0, z: 0 };
  var scale = {x: 1, y: 1};
  var rotate3d = {x: 0, y: 0, z: 0, angle: 0};
  if (styleTransform != null && styleTransform != '') {

    styleTransform = styleTransform.toLowerCase();
    var a = styleTransform.match(/(?:translate3d).+?\)/);
    if (a != null) {
      var a1 = a[0].split(/translate3d/)[1].match(/\d+/g);
      translate3d = {x: Number(a1[0]), y: Number(a1[1]), z: Number(a1[2]) }
    }

    var b = styleTransform.match(/(?:scale).+?\)/);
    if (b != null) {
      var b1 = b[0].split(/scale/)[1].match(/\d+/g);
      scale = {x: Number(b1[0]), y: Number(b1[1])}
    }

    var c = styleTransform.match(/(?:rotate3d).+?\)/);
    if (c != null) {
      var c1 = c[0].split(/rotate3d/)[1].match(/\d+/g);
      rotate3d = {x: Number(c1[0]), y: Number(c1[1]), z: Number(c1[2]) , angle: Number(c1[3])};
    }
  }

  dom.__transform = {
    translate3d: translate3d,
    scale: scale,
    rotate3d: rotate3d
  };

  dom.transform = function (transform) {

    var value = [
      'translate3d(' + transform.translate3d.x + 'px, ' + transform.translate3d.y + 'px, 0)',
      'scale(' + transform.scale.x + ', ' + transform.scale.y + ')',
      'rotate3d('+ transform.rotate3d.x +','+ transform.rotate3d.y +','+ transform.rotate3d.z +','+  transform.rotate3d.angle + 'deg)'
    ];

    value = value.join(" ");
    this.style.webkitTransform = value;
    this.style.mozTransform = value;
    this.style.transform = value;

    this.__transform = transform;
    this.__transform.prev = {
      translate3d: JSON.parse(JSON.stringify(this.__transform.translate3d)),
      scale: JSON.parse(JSON.stringify(this.__transform.scale)),
      rotate3d: JSON.parse(JSON.stringify(this.__transform.rotate3d))
    };

    return this

  };


  dom.__enhanced = true;
  return dom

};