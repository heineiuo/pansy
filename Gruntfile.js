'use strict';
module.exports = function(grunt) {

  var build = '3'
  var version = "0.1.0"
  var purpleVersion = "0.3.3"
  var path = {};
  var proj_name = 'purple'
      path.grunt= '';
      path.src  = proj_name+'_src';
      path.dist = __dirname+'/../'+proj_name
      path.src_assets = path.src+'/';
      path.dist_assets = path.dist+'/b/'+build+'/';


  var mainCSSBanner = '/**\n'+
  ' * main.css b'+build+'\n'+
  ' */'

  var mainJSBanner = '/**\n'+
  ' * main.js b'+build+'\n'+
  ' */\n'

  var purpleJSBanner = '/**\n'+
  ' * purple.js v'+purpleVersion+ ' http://purple.heineiuo.com\n'+
  ' * @author Hansel http://heineiuo.com\n'+
  ' */\n'

  grunt.initConfig({

    concat: {
      options: {
        separator: '\n',
      },
      static_mappings: {
        files: [
          {src: [ path.src_assets+"js_main/**/*.js" ], dest: path.dist_assets+'main.js'},
          {src: [ path.src_assets+"js_purple/**/*.js" ], dest: path.dist_assets+'purple.js'},
          {src: [ path.src_assets+"less_main/**/*.less" ], dest: path.dist_assets+'main.less'},
        ],
      },
    },

    htmlmin: {
      options: {
        removeComments: true,
        collapseWhitespace: true
      },
      dynamic_mappings1: {
        options: {
          keepClosingSlash: false,
        },
        files: [
          {
            expand: true,
            cwd: path.src,
            src: ['*.html'],
            dest: path.dist,
            ext: '.html',
          }
        ],
      },
      dynamic_mappings: {
        files: [
          {
            expand: true,
            cwd: path.src_assets+'html/',
            src: ['**/*.html'],
            dest: path.dist_assets+'html/',
            ext: '.html',
          },
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

      file_a: {
        options: {
          banner: mainJSBanner,
          mangle: {
            except: ['jQuery', 'require']
          }
          // compress: false,
          // beautify: true
        },
        files: [
          {
            src: [ path.dist_assets+'main.js' ],
            dest:  path.dist_assets+'main.min.js',
          }

        ],
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
            src: [ path.dist_assets+'purple.js' ],
            dest:  path.dist_assets+'purple.min.js',
          }

        ],
      }

    },

    less: {
      options: {
        cleancss: false,
      },
      dynamic_mappings: {

        files: [
          { src: [ path.dist_assets+"main.less"], dest: path.dist_assets+"main.css"}
        ]

      },
    },

    cssmin:{
      options: {
       banner: mainCSSBanner,
      },
      static_mappings: {
        files: [
          {src: [ path.dist_assets+"main.css" ], dest: path.dist_assets+"main.min.css"},
        ],
      }
    },

    copy: {
      main: {
        files: [

          {expand: true, cwd: path.src_assets+'html/', src: ['**'], dest: path.dist_assets+'html/'},
          {expand: true, cwd: path.src_assets+'images/', src: ['**'], dest: path.dist_assets+'images/'},
          {expand: true, cwd: path.src_assets+'fonts/', src: ['**'], dest: path.dist_assets+'fonts/'},
          {expand: true, cwd: path.grunt, src: ['LICENSE.txt'], dest: path.dist},

        ]
      }
    },

    compress: {
      foo: {
        options: {
          archive: 'snapshot/purple_b'+build+'_'+Date.now()+'.zip',
          mode: 'zip'
        },
        files: [
          {
            src: [
              path.grunt+'Gruntfile.js',
              path.grunt+'package.json',
              path.grunt+'README.md',
              path.grunt+'src/**/*'
            ]
          }
        ]
      }
    },

  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.registerTask('build', ['concat','htmlmin','uglify','less','cssmin','compress', 'copy']);
  grunt.registerTask('build1', ['uglify']);
};