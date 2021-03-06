/**
 * 错误处理中间件判断
 * @param fn
 * @returns {boolean}
 */

function errHandleChecker(fn){
  try {
    return fn.toString().match(/[A-Z0-9a-z,(\s]*\)/)[0].split(',').length == 4
  } catch(e){
    return false
  }
}

module.exports = errHandleChecker