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
                    'dist/js/red.js': [
                        "head.js",
                        "route.js",
                        "foot.js"
                    ]
                }
            }
        },

        uglify: {
            options: {
                banner: '/*! RED.js <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            dist: {
                files: {
                    'dist/js/red.min.js': ['dist/js/red.js']
                }
            }
        },


        qunit: {
            files: ['test/**/*.html']
        },

        jshint: {
            files: ['Gruntfile.js', 'js/**/*.js'],
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
            files: ['Gruntfile.js', 'js/**/*.js', 'less/**/*.less'],
            tasks: ['concat', 'uglify', 'less', 'cssmin']
        }

    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    // grunt.loadNpmTasks('grunt-contrib-jshint');
    // grunt.loadNpmTasks('grunt-contrib-qunit');

    // grunt.registerTask('test', ['jshint', 'qunit']);
    // grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);

    // grunt.registerTask('default', ['concat', 'uglify']);

};