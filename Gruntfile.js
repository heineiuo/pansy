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
                    'tmp/purple-<%= pkg.version %>.js': [
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
                    drop_console: true,
                    drop_debugger: true,
                    banner: '/*! PURPLE.js v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                files: {
                    'tmp/purple-<%= pkg.version %>.min.js': ['tmp/purple-<%= pkg.version %>.js']
                }
            },

            debug: {
                options: {
                    banner: '/*! PURPLE.js v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                files: {
                    'tmp/purple-<%= pkg.version %>.debug.min.js': ['tmp/purple-<%= pkg.version %>.js']
                }
            }
        },


        watch: {
            files: ['Gruntfile.js', 'src/**/*.js'],
            tasks: ['concat', 'uglify']
        }

    });


    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

};