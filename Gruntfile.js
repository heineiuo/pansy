'use strict';
module.exports = function(grunt) {


  var pkg = grunt.file.readJSON('package.json')
  var name = pkg.name
  var version = pkg.version
  var dir = {}
      dir.src  = 'src'
      dir.dist = 'dist'

  var purpleJSBanner = '/**\n'+
  ' * '+name+' v'+version+ ' http://purple.heineiuo.com\n'+
  ' * @author Hansel http://heineiuo.com\n'+
  ' */\n'

  grunt.initConfig({

    concat: {
      options: {
        separator: '\n',
      },
      static_mappings: {
        files: [
          {src: [ dir.src+"/**/*.js" ], dest: dir.dist+'/'+version+'/purple.js'},
        ],
      },
    },


    uglify: {
      options: {
        mangle: {
          except: ['jQuery', 'require']
        }
        // compress: false,
        // beautify: true
      },

      file_b: {
        options: {
          banner: purpleJSBanner,
          mangle: {
            except: ['jQuery', 'require']
          }
          // compress: false,
          // beautify: true
        },
        files: [
          {
            src: [ dir.dist+'/'+version+'/purple.js' ],
            dest:  dir.dist+'/'+version+'/purple.min.js',
          }

        ],
      }

    },

    compress: {
      foo: {
        options: {
          archive: 'snapshot/'+pkg.name+'_v'+pkg.version+'_'+Date.now()+'.zip',
          mode: 'zip'
        },
        files: [
          {
            src: [
              dir.grunt+'Gruntfile.js',
              dir.grunt+'package.json',
              dir.grunt+'README.md',
              dir.grunt+'src/**/*'
            ]
          }
        ]
      }
    },

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.registerTask('build', ['concat', 'uglify', 'compress']);
};