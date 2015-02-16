/**
 * purple.js v0.4.0 http://purple.heineiuo.com
 * @author Hansel http://heineiuo.com
 * 
 * @require jQuery.js http://jquery.com/
 */

(function (window) {

function factory(window, $) {

/**
 * private
 */
var __purple = {}

/**
 * 获取对象长度
 */
function objLength(obj) {
  var j = 0;
  for ( i in obj ) {
    j++
  }
  return j;
}

/**
 * 检测是否在数组内
 */
function in_array(needle, haystack) {


    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(typeof haystack[i] == 'object') {
            if(arrayCompare(haystack[i], needle)) return true;
        } else {
            if(haystack[i] == needle) return true;
        }
    }
    return false;


}

function arrayCompare(a1, a2) {
  if (a1.length != a2.length) return false;
  var length = a2.length;
  for (var i = 0; i < length; i++) {
      if (a1[i] !== a2[i]) return false;
  }
  return true;
}


/**
 * 清除数组内指定元素
 */
function arrayClean(arr,deleteV) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == deleteV) {           
      arr.splice(i, 1);
      i--;  
    }
  } 
  return arr;
}

/**
 * 删除多维数组中的某个数组
 */

function deleteArr(bigarr,smallarr) {
  for (var i = 0; i < bigarr.length; i++) {
    if (arrayCompare(bigarr[i], smallarr)) {           
      bigarr.splice(i, 1);
      i--;  
    }
  } 
  return bigarr;
}

function cloneArray(arr) {
  return JSON.parse(JSON.stringify(arr))
}


/**
 * 获取obj的子对象数组
 */
function getKeys( obj ) {
  var ret = [];
  for ( var key in obj ) {
    if ( obj.hasOwnProperty(key) ) {
      ret.push( key );
    }
  }
  return ret;
};

/**
 * 遍历数组
 */
function forEach( array, iter ) {
  for ( var i = 0, l = array.length; i < l; i++ ) {
    var value = array[i];
    iter.call( this, value, i, array );
  }
};

/**
 * 二叉树对象转一维数组
 */
function obj2arr(obj) {
  var result = [];

  function re(obj, prev) {
    Object.keys(obj).forEach(function(item) {
      var hehe = [];
      if (obj[item] instanceof Object && !(obj[item] instanceof Array)) { // 不包含数组
      // if (obj[item] instanceof Object) { // 包含数组
        if (prev.length) {
          hehe = prev.concat()
        }
        hehe.push(item)
        result.push(hehe);
        re(obj[item], hehe);
      }
    });
  }

  re(obj, []);
  return result;
}

/**
 * 获取对象中的元素，并保存为数组
 */
function objElements (obj) {
  var result = [];

  function re(obj) {
    Object.keys(obj).forEach(function(item) {
      if (obj[item] instanceof Object && !(obj[item] instanceof Array)) { // 不包含数组
      // if (obj[item] instanceof Object) { // 包含数组

        result.push(item);
        re(obj[item]);
      }
    });
  }

  re(obj);
  return result;
}



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




/**
 * 在父级元素中查找标签
 */
function getParentByTag(dom, nodename) {
  if (dom.nodeName == 'BODY') {
    return false;
  }

  if (dom.nodeName == nodename) {
    return p
  };

  var p = getParent(dom);
  return getParentByTag(p)

  /**
   * 获取父级元素
   */
  function getParent(dom) {
    return dom.parentNode || dom.parentElement
  }
}


  
/**
 * 在父级元素中查找router，找得到返回routername，招不到返回false
 */
function getRouter(dom) {

  var p = getParent(dom);

  if (p.nodeName == 'HTML') {
    return false;
  }
  
  /**
   * 获取id
   */
  var pid = p.id

  if (pid!='' && isRouter(pid)) {
    /**
     * 返回router name
     */
    return pid.substring(5)
  }
  return getRouter(p)

  /**
   * 获取父级元素
   */
  function getParent(dom) {
    return dom.parentNode || dom.parentElement
  }

  /**
   * 检查是否是state
   */
  function isRouter(id) {
    return /state[a-z]+/.test(id)
  }

}


function isDefined(arg)   { return typeof arg != 'undefined' }
function isUndefined(arg) { return typeof arg == 'undefined' }
function isFunction(arg)  { return typeof arg == 'function'  }
function isBoolean(arg)   { return typeof arg == 'boolean'   }
function isString(arg)    { return typeof arg == 'string'    }
function isNumber(arg)    { return /^\d+$/.test(arg)         }
function isArray(arg)     { return arg instanceof Array      }
function isRegExp(arg)    { return arg instanceof RegExp     }
function isDate(arg)      { return arg instanceof Date       }
function isObject(arg)    { return arg instanceof Object     }
function isNull(arg)      { return arg === null || arg === ''}
function isEmpty(obj)     { for (var name in obj) { return false;} return true;}






/**
 * URL 解析
 * 2014-05-27 13:24:33

 source == origin+pathname+search+hash
 source == origin+relative
 source == protocol+hostname+port+relative

 search即从origin后的第一个?开始，到第一个#号之前
 hash从第一个#开始，一直到结束

 所以先判断hash，将href中的hash成分去除
 再判断search，只要看看还有没有?号即可
 剩下的就是origin+pathname了

 如果origin不是当前的origin，则用location.replace(source)进行跳转。

 */
function parseURL(url) {
  var a =  document.createElement('a');
  a.href = url;


  /**
   * IE下，a.pathname是不显示第一个字符'/'的，
   * 这会导致'/'这种url获取不到真实的pathname（会显示空字符）
   * 所以修正下，手动加上'/'
   */
  var ppx = a.pathname || '/'+ a.pathname

  var result = {
    href: a.href,
    origin: a.origin,
    source: url,
    protocol: a.protocol.replace(':',''),
    hostname: a.hostname,
    port: a.port,
    relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1], //  除去origin之外的全部

    /**
     * pathname字符串+一维数组
     */
    pathname: ppx.replace(/^([^\/])/,'/$1'),
    pathnames: arrayClean(a.pathname.replace(/^\//,'').split('/'),''),

    /**
     * search字符串+关联数组
     */
    search: a.search,
    searches: (function(){
      var ret = {},
        seg = a.search.replace(/^\?/,'').split('&'),
        len = seg.length, i = 0, s;
      for (;i<len;i++) {
        if (!seg[i]) { continue; }
        s = seg[i].split('=');
        ret[s[0]] = s[1];
      }
      return ret;
    })(),

    /**
     * hash字符串+关联数组
     */
    hash: a.hash.replace('#',''),
    hashes: arrayClean(a.hash.replace(/^(#)*/i,'').replace(/^\//,'').split('/'),''),

    file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
  }



  var parsedURL = String();
  parsedURL += '/'+result.pathnames.join('/')



  if(objLength(result.searches)>0){
    parsedURL += String('?');
    for (x in result.searches) {
      parsedURL += x + '='
      parsedURL += ('undefined' != typeof result.searches[x]) ? result.searches[x]: ''
      parsedURL += '&'
    };
    parsedURL = parsedURL.substring(0, parsedURL.length-1)
  }


  if (result.hashes.length>0) {
    parsedURL += '#'
    for (var i = 0; i < result.hashes.length; i++) {
      if (i<result.hashes.length-1) {
        parsedURL += result.hashes[i] + String('/')
      } else {
        parsedURL += result.hashes[i]
      }
    };
  };



  result.parsedURL = parsedURL

  return result
}

/**
 * ajax控制中心
 * @author @smilevcard
 * 2014-03-29 16:57:38
 * 
 * 借助于jQuery的ajax模块
 *
 */
function ajax(argument) {

  var url = argument.url || __purple.apipath
  var callback = argument.callback || function () {}
  var data = argument.data || {}
  var type = argument.type || 'POST'
  var dataType = argument.dataType || 'json'

  $.ajax({
    url: url,
    type: type,
    dataType: dataType,
    data: data,
  })
  .done(function (data) {
    if(__purple.debug){
      console.log(data)
    }

    if ('undefined' == typeof data.error) {
      callback(data)
    } else {
      if ('undefined' != typeof argument.error) {
        argument.error(data, function (err) {
          if (err) {
            __purple.ajaxErrorHandle(data)
          }
        })
      } else {
        __purple.ajaxErrorHandle(data)
      }
    }
  })
  .fail(function (jqXHR) {

    if ('undefined' != typeof argument.fail) {
      argument.fail(data, function (err) {
        if (err) {
          __purple.ajaxFailHandle(data)
        }
      })
    } else {
      __purple.ajaxFailHandle(data)
    }

  })

}

/**
 * ajax 返回Error处理
 */
function ajaxErrorHandle(data) {
  if (__purple.debug) {
    console.log(data)
  };

}

/**
 * ajax 服务器无响应处理
 */
function ajaxFailHandle(jqXHR) {
  if (__purple.debug) {
    console.log(jqXHR)
  };

}



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


/**
 * @public html加载器
 * 根据jackname获取html片段
 * 2014-03-31 19:52:20
 */
function html(name, frag) {

  if ( 'undefined' != typeof frag ) { // 将字符串载入__purple.html

    __purple.html[name] = handleFrag(frag)

  } else if ( !isDefined(__purple.html[name])) { // 服务器获取

    $.ajax({
      url: __purple.htmlpath + '/' + name + '.html',
      type: 'GET',
      dataType: 'html',
      async: false
    })
    .done(function (frag) {

      __purple.html[name] = handleFrag(frag)

    })
    .fail(function (jqXHR) {
      // 重大错误
      if(__purple.debug) {
        console.log(jqXHR)
      }
    })
  }

  // 缓存中已存在

  return __purple.html[name];


  function handleFrag (frag) {
    var wrap = document.createElement('div');
    wrap.innerHTML = frag
    wrap = (wrap.childNodes.length == 1)?wrap.childNodes[0]:wrap
    return wrap
  }
}



function jack(jackname, frag) {

  if (!__purple.jacks[jackname].ready) {

    if ('undefined' == typeof frag) {
      html(jackname)
    } else {
      html(jackname, frag)
    }
    
    clearDataJack(jackname)
    __purple.jacks[jackname]['ready'] = true

  }

  return __purple.html[jackname]


  function clearDataJack (jackname) {

    /**
     * 清理data-jack节点， 给他们加上id
     */
    var $datajacks = $(__purple.html[jackname]).find('[data-jack]')
    for (var i = 0; i < $datajacks.length; i++) {

      var $item = $datajacks.eq(i)

      var itemJackname = $item.attr('data-jack')

      if ('undefined' == typeof __purple.jacks[itemJackname]) {
        __purple.jack_id ++
        __purple.jacks[itemJackname] = {
          id: 'ppjack' + String(__purple.jack_id),
          ready: false
        }
      }

      if ('string' == typeof $item.attr('id')) { // 如果自带id，使用自带id
        __purple.jacks[itemJackname]['id'] = $item.attr('id')
      }

      $item.attr('id', __purple.jacks[itemJackname]['id'])

      if (!__purple.debug) { // 如果是生成模式，dom中不暴露data-jack
        $item.attr('data-jack', null)
      };


    }


    /**
     * 清理 id
     */
    if (__purple.html[jackname].id != '') {
      __purple.jacks[jackname]['id'] = __purple.html[jackname].id
    } else {
      __purple.html[jackname].id = __purple.jacks[jackname]['id']
    }


    return __purple.html[jackname]

  }

}

/**
 * 初始化
 */
function init(config){

  /**
   * 清除绑定的事件
   * @param {__purple.eventLib}
   * @param {__purple.eventLib.type} 触发方式，点击或者滑动
   * @param {__purple.eventLib.target} dom对象
   * @param {__purple.eventLib.target的值} 函数名
   */
  for(name in __purple.machineNames){
    clearEvents(__purple.machines[name])
  }

  /**
   * 清空__purple
   */
  __purple = {};

  /**
   * 重新定义__purple
   */
  __purple = {
    timestamp: Date.now(),
    htmlsuffix: config.htmlsuffix  || null,
    htmlpath: config.htmlpath || '/html/',
    debug: config.debug || false,
    errorHandle: config.errorHandle || errorHandle,

    ajaxErrorHandle: config.ajaxErrorHandle || ajaxErrorHandle,
    ajaxFailHandle: config.ajaxFailHandle || ajaxFailHandle,
    progressHandle: config.progressHandle || progressHandle,

    progressShow: config.progressShow || false,
    autoCallback: config.autoCallback || autoCallback,
    listenA: config.listenA || false,
    listenP: config.listenP || false,
    pending: false,
    error: false,   // if here is error
    
    ua: null,    //user agent

    jack_id: 1,
    jacks: {},
    html: {},
    prevURL: null,
    eventArray: [], // global events
    machineNames: [],
    machines: {},
    machineMaster: null,

    events: {},
    fn: {},

    scope: new RegExp('^'+ (config.scope || location.origin)),


    config: config

  }

  if ( __purple.debug ) {
    purple.debug = debug
  }

  if (__purple.listenA) {
    observerOn({
      eventItem: [document,'click','a',eventClickA]
    })
  };

  if ( __purple.listenP ) {
    observerOn({
      eventItem: [window,'popstate',eventPopsteate]
    })
  };


}
/**
 * 新建Machine
 * 2014-07-05 08:00:26
 */

function newMachine(arguments) {

  __purple.machineNames.push(arguments.machine)

  var a = {
    prevDiffState: null,
    states: {},
    stateNow: null,
    statePrev: null,
    stateNames: [],
    stateReadyNames: [],
    eventArray: [],
    url: null
  }

  if (isDefined(arguments.routerCondition)) {
    a.routerCondition = arguments.routerCondition
    a.needCondition = true
  } else {
    a.needCondition = false
  }

  if (isDefined(arguments.notFoundHandle)) {
    a.notFoundHandle = arguments.notFoundHandle
  };
  
  if (arguments.master) {
    __purple.machineMaster =  arguments.machine
  }

  __purple.machines[arguments.machine] = a


}
/**
 * @public 监听器
 * 
 */
function observerOn(arguments) {
  var eventItem = arguments.eventItem;
  var eventArray = ('undefined' != typeof arguments.machine)?
    __purple.machines[arguments.machine].eventArray:__purple.eventArray

  if ( !in_array(eventItem, eventArray) ) {
    eventArray.push(eventItem);
    switch(eventItem.length){
      case 3:
        // container,type,handle
        $(eventItem[0]).on(eventItem[1],eventItem[2])
        break;
      case 4:
        // container,type,target,handle
        $(eventItem[0]).on(eventItem[1],eventItem[2],eventItem[3]);
        break;
    }
  }
}

function observerOff(arguments) {
  var eventItem = arguments.eventItem;
  var eventArray = ('undefined' != typeof arguments.machine)?
    __purple.machines[arguments.machine].eventArray:__purple.eventArray

  if ( in_array(eventItem, eventArray) ) {
    switch(eventItem.length){
      case 3:
        // container,type,handle
        $(eventItem[0]).off(eventItem[1],eventItem[2])
        break;
      case 4:
        // container,type,target,handle
        $(eventItem[0]).off(eventItem[1],eventItem[2],eventItem[3]);
        break;
    }
    eventArray = deleteArr(eventArray, eventItem)
  }
}
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




  var purple = window.purple = {


    init: function (arguments) {
      init(arguments)
    },

    machine: function (arguments) {
      newMachine(arguments)
    },

    newMachine: function (arguments) {
      newMachine(arguments)
    },

    html: function (name,frag) {
      return html(name,frag)
    },

    on: function (arguments) {
      observerOn(arguments)
    },

    off: function (arguments) {
      observerOff(arguments)
    },

    router: function (arguments) {
      router(arguments)
    },

    route: function (arguments) {
      router(arguments)
    },
    
    define: function(arguments){
      define(arguments)
    },

    progress: function(arguments) {
      if ( __purple.progressShow ) {
        progressHandle(arguments)
      }
    },

    parseURL: function (argument) {
      return parseURL(argument)
    },

  /******************/



    getConfig: function () {
      return __purple.config
    },



  /**********************/


    add: function (methodName, fn) {

      if ('undefined' == typeof __purple.fn[methodName]) {
        __purple.fn[methodName] = fn
      } else {
        // console.log('some method has been added');
      }
      
    },

    set: function (methodName, fn) {

      if ('undefined' == typeof __purple.fn[methodName]) {
        __purple.fn[methodName] = fn
      } else {
        // console.log('some method has been added');
      }

    },

    get: function (methodName) {
      return __purple.fn[methodName]
    },


    addEvent:  function (eventName, fn) {
      if ('undefined' == typeof __purple.events[eventName]) {
        __purple.events[eventName] = fn
      } else {
        // console.log('some event method has been added');
      }
    },

    getEvent: function (eventName) {
      return __purple.events[eventName]
    },


    ajax: function (arguments) {
      ajax(arguments)
    },


    /********************/

    setCookie: setCookie,
    getCookie: getCookie,
    removeCookie: removeCookie


  }

  

} // END factory





  if ( typeof define === "function" && define.amd ) {
    
    define(['jquery'], function ($) {

      factory(window, $)
      return purple

    })

  } else {

    factory(window, jQuery)

  }

})(window)