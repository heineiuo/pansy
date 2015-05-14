'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            js: {
                options: {
                    separator: ';'
                },
                files: {
                    'lib/purple.js': [
                        "src/head.js",
                        "src/core.js",
                        "src/render.js",
                        "src/debug.js",
                        "src/method.js",
                        "src/foot.js"
                    ]
                }
            }
        },

        uglify: {
            options: {
                banner: '/*! PURPLE.js v<%= grunt.package.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            dist: {
                files: {
                    'lib/purple.min.js': ['lib/purple.js']
                }
            }
        },

        copy: {
            options: {},
            dist: {
                files: {
                    'public/purple.js': ['lib/purple.js']
                }
            }
        },


        qunit: {
            files: ['test/**/*.html']
        },

        jshint: {
            files: ['Gruntfile.js', 'lib/purple.js'],
            options: {
                // options here to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },

        watch: {
            files: ['Gruntfile.js', 'src/**/*.js'],
            tasks: ['concat', 'uglify', 'copy']
        }

    });


    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    // grunt.loadNpmTasks('grunt-contrib-jshint');
    // grunt.loadNpmTasks('grunt-contrib-qunit');

    // grunt.registerTask('test', ['jshint', 'qunit']);
    // grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);

    // grunt.registerTask('default', ['concat', 'uglify']);

};