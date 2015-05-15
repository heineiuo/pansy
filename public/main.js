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

coreCtrl.replaceName = function (req, res, next) {

  res.end()
  next()

}

var mainApp = purple('main');
mainApp.route('/').get(coreCtrl.renderIndex)
mainApp.route('/hello').get(coreCtrl.renderHello, coreCtrl.replaceName)

purple.set('mainApp', 'main')
purple.start()