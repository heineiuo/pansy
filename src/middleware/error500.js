
function error500 (err, req, res, next){
  if (!err) return next()
  console.error(err)
  res.end()
}