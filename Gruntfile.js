'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {

            js: {
                options: {
                    separator: ';',
                    banner: '/*! PURPLE.js v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                files: {
                    '.grunt-cache/purple-<%= pkg.version %>.js': [
                        "src/head.js",
                        "src/util.js",
                        "src/core.js",
                        "src/foot.js"
                    ]

                }
            }
        },


        uglify: {
            min: {
                options: {
                    compress: {
                        drop_debugger: true,
                        drop_console: true
                    },
                    banner: '/*! PURPLE.js v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                files: {
                    '.grunt-cache/purple-<%= pkg.version %>.min.js': ['.grunt-cache/purple-<%= pkg.version %>.js']
                }
            },

            debug: {
                options: {
                    banner: '/*! PURPLE.js (DEBUG) v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                files: {
                    '.grunt-cache/purple-<%= pkg.version %>.debug.min.js': ['.grunt-cache/purple-<%= pkg.version %>.js']
                }
            }
        },
        
    
        copy: {
            //options: {},
            main: {
                files: {
                    'dist/purple-<%= pkg.version %>.min.js': ['.grunt-cache/purple-<%= pkg.version %>.min.js'],
                    'dist/purple-<%= pkg.version %>.debug.min.js': ['.grunt-cache/purple-<%= pkg.version %>.debug.min.js']
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