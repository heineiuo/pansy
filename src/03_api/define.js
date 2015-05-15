/**
 * @public 定义task
 * @author @heineiuo
 * 2014-03-29 22:51:03
 *
 * Define 定义一个task，或者说一个router
 * 定义完其实只是存储了这个router的信息
 * 当请求到这个router的时候，再使用Build来创建dom
 */

function define(arguments) {

  if (isUndefined(__purple.machines[arguments.machine])) {
    return false
  };

// 第一个参数生成正则化的task名;
// 第二个参数根据提一个参数获取url中的request值（可以有多个）;
// 从'#npo'的下一层开始识别和加载html
// 按层名区别不同的任务，

  /**
   * 如果'#npo'下面没有'content'，则新建一个'content';
   * 如果'content'底下有'[data-jack="content/action"]',
   * 在该jack后增加对应的html片段作为新的jack,
   * 同时新jack增加属性'[data-jack="content/action"]',
   * 并将旧jack删除, 保证一个dom里不会出现重复的jack;
   * 
   * 如果没有，则直接在'content'末尾增加;
   */
  var machineName = arguments.machine
  var name        = arguments.name
  var stateName   = name instanceof RegExp ? name : new RegExp('^\\\/'+name.join('\\\/')+'$')
  var jack     = arguments.jack || {}
  var events   = arguments.events   || []
  var callback = arguments.callback || function(){return true}
  var jackarr  = obj2arr(jack)
  var jacks    = objElements(jack)

  /**
   * 将jack格式化
   */
  for (var i = 0; i < jacks.length; i++) {
    if ('undefined' == typeof __purple.jacks[jacks[i]]) {
      __purple.jack_id ++
      __purple.jacks[jacks[i]] = {
        id: 'ppjack' + String(__purple.jack_id),
        ready: false
      }
    }
  }

  // if ( !name.length ) {
  //   errorHandle('BUILD_ERROR_NOREGNAME')
  //   return false;
  // };

  /**
   * 存储在TaskLib对象内，根据taskname取出
   * task名是正则表达化后的router
   */

   var a = __purple.machines[machineName]
   a.stateNames.push(stateName)

   var b = {
    name     : name,
    jack     : jack,
    jackarr  : jackarr,
    events   : events,
    callback : callback,
    url      : null,
    jackReady: false
  }

  if (isDefined(arguments.needCondition)) {
    b.needCondition = arguments.needCondition
  } else {
    b.needCondition = a.needCondition
  }

  if (isDefined(arguments.routerCondition)) {
    b.needCondition = true
    b.routerCondition = arguments.routerCondition
  };

  __purple.machines[machineName].states[stateName] = b


} // Define end