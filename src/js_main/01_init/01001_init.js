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

