function routeChecker(req, path){
  try {
    return req.filterPath.match(path)[0] == req.filterPath
  } catch(e){
    return false
  }
}

module.exports = routeChecker