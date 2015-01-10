

purple.newMachine({
  machine: 'pop'
})


/**
 * 首页
 */
purple.define({
  machine: 'pop',
  name: [''],
  jack: {
  },
  events: [

  ],
  callback: function (argument) {


    purple.progress(100)

  }
})

purple.define({
  machine: 'pop',
  name: ['banner'],
  jack: {
    "pop/banner": {}
  },
  events: [

  ],
  callback: function (argument) {


    purple.progress(100)

    setTimeout(function () {
      $('#popBanner').animate({'opacity': 0}, 300,
        function() {
          purple.router({
            machine:"pop",
            href: "/"
          })
      })
    }, 3000)

  }
})

