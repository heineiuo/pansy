/**
 * @public 进入调试模式
 */



function debug(name, v){

  if (typeof name == 'undefined') {
    console.log(__purple)
  }
  
}

function errorHandle(errorCode,errorMsg) {
  if ( __purple.debug ) {
    
    var errorCode = errorCode || ''
    var errorMsg = errorMsg || ''
    console.error(errorCode+': '+errorMsg)
  };
}

/**
 * 显示加载进度
 */
function progressHandle(percent) {
    
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
        $('body').append($('<div id="npop"><style>#npop{z-index:1000000;position:fixed;top:0;right:0;left:0;height:4px}#npop .power{position:absolute;top:0;bottom:0;left:0;background-color:rgb(85,185,215);transition:all .5s ease}</style><div class="power"></div></div>'))
      };
      $('#npop .power').css({width:percent+'%'})
    }

    function b(){
      $('#npop').remove()
    }


}


function autoCallback(){
  
}


function loadLang(arguments) {
  __purple.lang = arguments
}

