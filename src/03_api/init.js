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

  if ( __purple.listenA ) {
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