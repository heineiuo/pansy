/**
 * @private 组装器
 * @author @heineiuo
 * 2014-03-29 22:53:20
 *
 * 根据传入的实际路径和请求参数
 * 调取TaskLib中对应的lib数据，创建build
 */
function build (arguments, callback) {

  var machineName = arguments.machine
  var machine = __purple.machines[machineName]
  var stateName = arguments.stateName
  var newState = machine.states[stateName]; // 新task对象
  var machineDOM = document.getElementById('state'+machineName)
  if (machineDOM == null) {
    machineDOM = document.createElement('div')
    machineDOM.id = 'state'+machineName
    document.body.appendChild(machineDOM)
  };


  /**
   * 该machine是否router过，1代表第一次，2代表router过
   */
  if ( !isNull(machine.stateNow) ) { // 存在旧task的情况，需要比对旧task的jack信息

    var nowState = machine.states[machine.stateNow]; // 旧task对象
    nowState.jackarr = obj2arr(nowState.jack)

    /**
     * 解除旧对象的事件绑定
     * 防止受上一个task的影响
     */
    clearEvents(machine)

    /**
     * 检查上一个task里面有没有可以“保留”的jack
     * （不能被保留的，隐藏掉）
     */
    for (var i = 0; i < nowState.jackarr.length; i++) {
      if ( !in_array(nowState.jackarr[i], newState.jackarr) ) {
        /**
         * 旧的不存在新的里面，剔除（清空并重设jack）
         */
        hideJack(nowState.jackarr[i])

      }
    }

    /**
     * 检查dom树，有没有可以“复活”的jack
     * 如果
     */
    for (var i = 0; i < newState.jackarr.length; i++) {

      if (newState.jackReady) {

        showJack(newState.jackarr[i])

      } else if ( in_array( newState.jackarr[i], nowState.jackarr) ) { // dom里面有，直接显示

        showJack(newState.jackarr[i])

      } else { //dom里面没有该jack，需要加载

        buildJack(newState.jackarr[i])
      }



    }

  } else {// 没router过

    /**
     * 不需要检查，直接遍历加载
     */
    for (var i = 0; i < newState.jackarr.length; i++) {
        buildJack(newState.jackarr[i])
    }

  }

  purple.progress(40)

  // 更新state
  machine.statePrev = machine.stateNow // 将当前的task移入旧task
  machine.stateNow  = stateName // 将当前的task名更新

  // 绑定事件
  for (var i = 0; i < newState.events.length; i++) {
    observerOn({
      machine: machineName,
      eventItem: newState.events[i]
    })
  }

  // 回调
  callback()




  /**
   * 组装html/jack
   * @heineiuo
   * 2014-03-31 21:24:43
   */
  function buildJack(jacktree) { // jacktree 是数组

    if ('undefined' != typeof __purple.jacks[jacktree[jacktree.length-1]]['loaded']) {
      showJack(jacktree)
    } else {

      var newjack  = getJack(jacktree[jacktree.length-1])
      var newjack2 =    jack(jacktree[jacktree.length-1])

      if (newjack == null) { // 当前dom中没有标注jack位置，自动计算位置

        var parentJack = (jacktree.length == 1)?machineDOM:getJack(jacktree[jacktree.length-2])
        $(parentJack).append(newjack2)

      } else {

        $(newjack).after(newjack2)
        $(newjack).remove()

      }
    }


    __purple.jacks[jacktree[jacktree.length-1]]['loaded'] = true

  }


  /**
   * 隐藏jack
   */
  function hideJack(jacktree){
    getJack(jacktree[jacktree.length-1]).style.display = 'none'
  }

  /**
   * 显示jack
   */

  function showJack(jacktree){
    getJack(jacktree[jacktree.length-1]).style.display = 'block'
  }

  /**
   * getJack
   */
  function getJack (jack) {
    return document.getElementById(__purple.jacks[jack]['id'])
  }


} // End of ling.

