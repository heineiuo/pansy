module.exports = {
  indexJS: {
    src : '.grunt/<%= pkg.name %>.js',
    dest : '.grunt/<%= pkg.name %>.returnExportsGlobal.js',
    template : 'returnExportsGlobal',
    objectToExport : 'pansy',
    globalAlias : 'pansy',
    indent : 2,
    deps : {}
  }
}