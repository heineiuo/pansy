

purple.newMachine({
  machine: 'main',
  master: true
})



/**
 * 首页
 */
purple.define({
  machine: 'main',
  name: [''],
  jack: {
    "main/main": {
      "home/home": {}
    }
  },
  events: [

  ],
  callback: function (argument) {
  
    $('.navbar-wrap').removeClass('fix')
    headertab('home')
    purple.progress(100)

  }
})




/**
 * faq
 */
purple.define({
  machine: 'main',
  name: ['faq'],
  jack: {
    "main/main": {
      "faq/faq": {}
    }
  },
  events: [

  ],
  callback: function (argument) {


    headertab('faq')
    purple.progress(100)

  }
})





/**
 * case
 */
purple.define({
  machine: 'main',
  name: ['case'],
  jack: {
    "main/main": {
      "case/case": {}
    }
  },
  events: [

  ],
  callback: function (argument) {


    headertab('case')
    purple.progress(100)

  }
})


