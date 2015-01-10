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