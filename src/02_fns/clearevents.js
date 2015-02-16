

/**
 * @param {__purple.eventLib} 
 * @param {__purple.eventLib.type} 触发方式，点击或者滑动
 * @param {__purple.eventLib.target} dom对象
 * @param {__purple.eventLib.target的值} 函数名
 */
function clearEvents(machine) {
  for (var i = 0; i < machine.eventArray.length; i++) {
    var a = machine.eventArray[i];
    $(a[0]).off(a[1],a[2],a[3])
  }
  
  machine.eventArray = [] // 清空事件集
}
