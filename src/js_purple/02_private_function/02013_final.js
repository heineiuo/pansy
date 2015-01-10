
/**
 * 绑定a标签点击事件
 */

function eventClickA(event) {

    /**
     * 获取目标dom
     */
    var $a = $(event.target).closest('a');

    /**
     * 如果是打开新标签，不处理
     */

    var href = $a.attr('href') || 0
    var target = $a.attr('target') || 0

    if (href != 0 && target==0) {

      var transport = parseURL(href)

      if (__purple.scope.test(transport.href)) {

        var machine = getRouter($a[0]);

        /**
         * 如果没有控制器，不处理（比如打算搞的spinner）
         */
        if ( machine != false ) {

          if ( event && event.preventDefault ) {
            event.preventDefault();
          } else {
            window.event.returnValue = false;
          }

          routerHandle({
            machine: machine,
            transport: transport,
            type: 'push',
            clearCache: false
          })

        }
        
      };

    };



}



// /** 
//  * 监听url改变事件  window.onpopstate
//  */

function eventPopsteate(){

  var transport = parseURL(location.href)
  if (__purple.scope.test(transport.href)) {

    routerHandle({
      machine: __purple.machineMaster,
      transport: transport,
      type:'replace',
      clearCache: false
    })
  
  }

}

