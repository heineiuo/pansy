var mainApp = purple('main');
var coreCtrl = {}

coreCtrl.renderIndex = function (req, res, next) {
  mainApp.render({
    "index/index": {}
  })

  res.end()
}

coreCtrl.renderHello = function (req, res, next) {

  mainApp.render({
    "index/index": {
      "index/hello": {}
    }
  })

  next()
}

coreCtrl.replaceName = function (req, res) {

  $('.name').text(req.query.name)
  res.end()

}

mainApp.route('/').get(coreCtrl.renderIndex)
mainApp.route('/hello').get(coreCtrl.renderHello, coreCtrl.replaceName)

purple.start()