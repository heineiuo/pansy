function errHandleChecker(fn){
  try{
    return fn.toString().match(/[a-z,(\s]*\)/)[0].split(',').length == 4
  } catch(e){
    return false
  }
}