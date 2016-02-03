var _ = require('lodash')

var tasks = [
  'uglify',
  'webpack',
  'umd'
]

var conf = {}

_.map(tasks, function(item, index){
  conf[item] = {}
  conf[item] = _.assign(conf[item], require('./release/'+item))
})


module.exports = function(grunt){

  conf.pkg = grunt.file.readJSON('package.json')

  grunt.initConfig(conf);

  grunt.registerTask('release', [
    'webpack:indexJS',
    'umd:indexJS',
    'uglify:indexJS'
  ])


  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-umd');


}