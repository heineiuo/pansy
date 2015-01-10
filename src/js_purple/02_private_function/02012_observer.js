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