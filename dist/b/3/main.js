(function(window){

function factory(window, $, purple) {


  var jQuery = $

  config = config || {}

  // progressShow: true,
  config.progressShow = false
  config.listenA = true
  config.listenP = true
  config.progressHandle = function (percent) {
    var percent = Number(percent) || 0;
    percent = percent>100?100:percent;
    percent = percent<0?0:percent;

    switch(percent){
      case 100:
        a(100);
        setTimeout(b,500)
        break;
      default:
        a(percent);
        break;
    }

    function a(percent){
      if (!$('#npop').length) {
        $('body').append($('<div id="npop"><style>#npop{z-index:1000000;position:fixed;top:0;right:0;left:0;height:3px}#npop .power{position:absolute;top:0;bottom:0;left:0;background-color: #F0E173;transition:all .5s ease}</style><div class="power"></div></div>'))
      };
      $('#npop .power').css({width:percent+'%'})
    }

    function b(){
      $('#npop').remove()
    }
  } // END PROGRESSHANDLE

  config.ajaxErrorHandle = function (data) {

    switch(data.error){
      case 30001:
        removeUserKey()
        alert('您未登录，需要登录吗？')
        break;
      case 10001:
        alert('请求错误！')
        break;
      default: 
        alert('未知错误！')
    }

  }



  purple.init(config)




/**
 * 以下依次为：
 * startup 打开页面立即执行的操作
 * registerSuccess 注册成功的操作
 * login 登录成功的操作
 * logout 退出成功的操作
 */

function startup() {

  if (window.innerWidth<=600) {
    $('body').addClass('small')
  };

  purple.router({href: location.href, machine: "main"})

  if (getCookie('welcomed') == null) {
    purple.router({href:'/banner', machine:'pop'})
    setCookie('welcomed','1','1')
  } else {
    purple.router({href:'/', machine:'pop'})
  }

  $('.loading').css({'display':'none'})


}


/**
 * cookie 操作
 */
function setCookie(name,value,days) {//cookie名，值，时间
  removeCookie(name)
  var Days = days || 30 //此 cookie 将被保存 30 天
  var expires  = new Date()    //new Date("December 31, 9998");
  expires.setTime(expires.getTime() + Days*24*60*60*1000)
  var path = '/'
  document.cookie = name + "="+ escape(value) + ";expires=" + expires.toGMTString()+';path='+path
}

function getCookie(name) {
  var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
  if(arr != null) return unescape(arr[2]); return null;
}

function removeCookie(name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval=getCookie(name);
  if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}

function title(val) {
  document.title = val + ' | smilevcard'
}


function headertab (tab) {
  $('.main .header .tab').removeClass('open')
  $('.main .header .tab-'+tab).addClass('open')
}

function upperFirstLetter (letter) {
  return letter.substr(0,1).toUpperCase()+letter.substr(1)
}


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
purple.addEvent('scrollWindow', function (event) {


  var t = document.body.scrollTop || document.documentElement.scrollTop

  if (t > 0) {
    $('.navbar-wrap').addClass('fix')
  } else {
    $('.navbar-wrap').removeClass('fix')
  }
  
})


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