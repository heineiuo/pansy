


purple.define({
  machine: "main",
  name: /^\/document(\/(api|setup)|)$/,
  jack: {
    "main/main": {
      "document/document": {
        "document/api": {}
      }
    }
  },
  events: [
    [window, 'scroll', purple.getEvent('scrollWindow')]
  ],
  callback: function (argument) {

    if (argument.pathnames.length == 2) {



      switch (argument.pathnames[1]) {

        case 'api':

          var $sec = $('#api'+upperFirstLetter(argument.hashes[0]))
          if ($sec.length) {
            document.body.scrollTop = $sec.offset().top - 50
            document.documentElement.scrollTop = $sec.offset().top - 50
          }

          if ($sec.offset().top>50) {
            $('.navbar-wrap').addClass('fix')
          };

          break;

        case 'setup':

          break;

      };

    }


    require(['prettify'], function (prettify) {

      loadCSS('http://static.heineiuo.com/libs/prettify/prettify_st.css')
      prettyPrint()
    })



    headertab('document')
    purple.progress(100)

  },
  leave: function (argument) {
    $('.navbar-wrap').removeClass('fix')
  }
})