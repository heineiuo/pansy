
  startup()
  a({
    keyPixel: [768, 992, 1200],
    keyName: ['min','small', 'large', 'max']
  })

  return {}



}


if (typeof define === 'function' && define.amd) {
  define(['jquery', 'purple'],function ($, purple) {
    return factory(window, $, purple)
  })
} else {
  factory(window, $, purple)
}

})(window)