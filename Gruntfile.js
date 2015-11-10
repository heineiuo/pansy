'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {

            js: {
                options: {
                    separator: ';\n',
                    banner: '/*! PURPLE.js v<%= pkg.version %> <%= grunt.template.today("UTC:yyyy-mm-dd HH:MM:ss Z") %> */\n'
                },
                files: {
                    '.grunt-cache/pansy-<%= pkg.version %>.js': [
                        "src/wrap/wrap.head",
                        "src/middleware/**/*.js",
                        "src/util/**/*.js",
                        "src/Router.js",
                        "src/Controller.js",
                        "src/core.js",
                        "src/wrap/wrap.foot"
                    ]
                }
            }
        },


        uglify: {
            min: {
                options: {
                    drop_debugger: true,
                    drop_console: true,

                    compress: {
                        drop_debugger: true,
                        drop_console: true
                    },
                    //mangleProperties: true,
                    banner: '/*! PURPLE.js v<%= pkg.version %> <%= grunt.template.today("UTC:yyyy-mm-dd HH:MM:ss Z") %> */\n'
                },
                files: {
                    '.grunt-cache/pansy-<%= pkg.version %>.min.js': ['.grunt-cache/pansy-<%= pkg.version %>.js']
                }
            },

            debug: {
                options: {
                    banner: '/*! PURPLE.js (DEBUG) v<%= pkg.version %> <%= grunt.template.today("UTC:yyyy-mm-dd HH:MM:ss Z") %>\n ' +
                    '* YOU CANNOT USE THIS FILE ON ANY OTHER PLATFORM.'  +
                    '*/\n'
                },
                files: {
                    '.grunt-cache/pansy-<%= pkg.version %>.debug.min.js': ['.grunt-cache/pansy-<%= pkg.version %>.js']
                }
            }
        },
        
        copy: {
            //options: {},
            main: {
                files: {
                    'dist/pansy.js': ['.grunt-cache/pansy-<%= pkg.version %>.js'],
                    'dist/pansy.min.js': ['.grunt-cache/pansy-<%= pkg.version %>.min.js'],
                    'dist/pansy.debug.min.js': ['.grunt-cache/pansy-<%= pkg.version %>.debug.min.js']
                }
            },

            libs: {
                files: {
                    '../webapp-sdk/libs/pansy/latest/pansy.js': ['.grunt-cache/pansy-<%= pkg.version %>.js'],
                    '../webapp-sdk/libs/pansy/latest/pansy.min.js': ['.grunt-cache/pansy-<%= pkg.version %>.min.js'],
                    '../webapp-sdk/libs/pansy/latest/pansy.debug.min.js': ['.grunt-cache/pansy-<%= pkg.version %>.debug.min.js']
                }
            }
        },

        clean: {
            all: ['.scss-cache', '.grunt-cache']
        },

        watch: {
            files: ['Gruntfile.js', 'src/**/*.js'],
            tasks: ['concat', 'uglify', 'copy', 'clean']
        }

    });


    grunt.registerTask('build', ['concat', 'uglify', 'copy', 'clean'])

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

};