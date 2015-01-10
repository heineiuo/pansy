

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