/**
 * @public 路由器
 * @author @heineiuo
 * 2014-03-30 15:47:05
 * 
 * 这是个路由器（笑
 * 第一个参数是url，第二个参数是history机制（记录还是重定向，或者不记录）
 */


function router (argument) {


  if ( __purple.pending ) {
    return false
  } 

  if ( isUndefined(__purple.machines[argument.machine]) ) {
    return false
  }


  var unParsedURL = argument.href || location.href // 原始链接
  var transport = parseURL(unParsedURL)


  routerHandle({
    machine: argument.machine,
    transport: transport,
    type: argument.type || 'push',
    clearCache: argument.clearCache || false
  })

}


function routerHandle(arguments) {



  purple.progress(5) // 开启进度加载提示

  var tempMachineName = arguments.machine
  var otherMachineNames = arrayClean(cloneArray(__purple.machineNames), tempMachineName)
  var type = arguments.type
  var clearCache = arguments.clearCache
  var $transport = arguments.transport

  purple.progress(15)

  loopState(0, tempMachineName, otherMachineNames, $transport.pathname, onEnd)




  /**
   * 从arguments中的machine开始找起，找到最终符合的state
   */
  function loopState(count, tempMachineName, otherMachineNames, pathname, callback) {

    if (count>=__purple.machines[tempMachineName].stateNames.length) {
      if (otherMachineNames.length == 0) {
        callback()
        return false
      } else {
        tempMachineName = otherMachineNames.shift()
        count = 0
      }
    }

    if (count<__purple.machines[tempMachineName].stateNames.length) {


      if ( __purple.machines[tempMachineName].stateNames[count].test(pathname) ) {
        callback(tempMachineName, __purple.machines[tempMachineName].stateNames[count]) // stateName machinename
        return false;
      }

    }

    count++
    loopState(count, tempMachineName, otherMachineNames, pathname, callback)

  } // END loopState



  /**
   * 遍历state集合之后，执行回调函数
   */
  function onEnd(machineName, stateName) {


    if ('undefined' == typeof machineName) {
      purple.progress(100) // 进度进入50%

      errorHandle('ERR_ROUTER_404', $transport.parsedURL)

      if (isDefined(__purple.machines[__purple.machineMaster].notFoundHandle)) {
        __purple.machines[__purple.machineMaster].notFoundHandle()
      }


    } else { // 匹配成功
      var machine = __purple.machines[machineName]
      var newState = machine.states[stateName]
      /**
       * 如果需要满足条件才能router， 走一遍条件
       */
      if (newState.needCondition) {

        var routerCondition = isDefined(newState.routerCondition)?
          newState.routerCondition:machine.routerCondition

        if (!routerCondition($transport)) { // 不满足router条件
          purple.progress(100)
          __purple.pending = false // 解除挂起状态
          return false
        }
      }

     /**
      * 进入挂起状态
      */
      __purple.pending = true

      /**
       * 如果这个状态机的这个状态最近是否加载过，而且将要加载的url正好就是这个状态加载过的状态
       */
      $transport.jackReady = true
      $transport.callReady = true
      if (clearCache) {
        $transport.jackReady = false
        $transport.callReady = false

      } else if (newState.jackReady) { // 加载过

        if ($transport.parsedURL != newState.url) {
          $transport.callReady = false
        } 

      } else { // 没加载过，重新加载

        $transport.jackReady = false
        $transport.callReady = false

      }

      /**
       * 该状态机url更新
       */
      $transport.prevURL = machine.url
      machine.url = $transport.parsedURL


      /**
       * 该状态url更新
       */
      $transport.statePrevURL = newState.url
      newState.url = $transport.parsedURL

      __purple.pending = false // 解除挂起状态

      /**
       * 该状态机差异状态url更新
       */
      if (machine.prevDiffState == null) {
        machine.prevDiffState = stateName
      } else {
        if (machine.prevDiffState.toString() != stateName.toString()) {
          $transport.prevDiffStateURL = machine.states[machine.prevDiffState].url
          machine.prevDiffState = stateName
        }
      }


      /**
       * 是否修改地址栏地址
       * 只有master才修改浏览器地址
       */
      if ( __purple.machineMaster == machineName ) {
        switch(type){
          case 'push': // 即普通的堆栈记录
            history.pushState('data', 'title', $transport.parsedURL);
            break
          case 'replace': // 将目前的纪录值替换掉
            history.replaceState('data', 'title', $transport.parsedURL);
            break
        }
      }


      /**
       * 发往内部建造器 build()
       */
      purple.progress(30)
      build({machine: machineName, stateName: stateName}, function () {
        newState.jackReady = true
            purple.progress(50) // 进度进入50%
          __purple.autoCallback() // 自动回调
        newState.callback($transport) // 指定回调

      })



      /**
       * 将解析过的url写入dom，debug
       */
      if (__purple.debug) {
        $('#state'+machineName).attr({'data-router': $transport.parsedURL})
      }


    }
  }　 // END onEnd

}


