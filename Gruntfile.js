/*!
 * FireShell Gruntfile
 * http://getfireshell.com
 * @author Todd Motto
 */

'use strict';

/**
 * Livereload and connect variables
 */
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({
  port: LIVERELOAD_PORT
});
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

/**
 * Grunt module
 */
module.exports = function (grunt) {

  /**
   * Dynamically load npm tasks
   */
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  /**
   * FireShell Grunt config
   */
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    /**
     * Set project info
     */
    project: {
      src: 'src',
      app: 'app',
      css: [
        '<%= project.src %>/sass/style.scss'
      ],
      js: [
        '<%= project.src %>/js/*.js'
      ]
    },




    /**
     * Project banner
     * Dynamically appended to CSS/JS files
     * Inherits text from package.json
     */
    tag: {
      banner: '/*!\n' +
              ' * <%= pkg.name %>\n' +
              ' * <%= pkg.title %>\n' +
              ' * <%= pkg.url %>\n' +
              ' * @author <%= pkg.author %>\n' +
              ' * @version <%= pkg.version %>\n' +
              ' * template: <%= pkg.template %>\n' +
              ' * Copyright <%= pkg.copyright %>. <%= pkg.license %> licensed.\n' +
              ' */\n'
    },




    /**
     * Connect port/livereload
     * https://github.com/gruntjs/grunt-contrib-connect
     * Starts a local webserver and injects
     * livereload snippet
     */
    connect: {
      options: {
        port: 9000,
        hostname: '*'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [lrSnippet, mountFolder(connect, 'app')];
          }
        }
      }
    },




    /**
     * JSHint
     * https://github.com/gruntjs/grunt-contrib-jshint
     * Manage the options inside .jshintrc file
     */
    jshint: {
      files: ['src/js/*.js'],
      options: {
        jshintrc: '.jshintrc',
        force: true
      }
    },





    /**
     * Concatenate JavaScript files
     * https://github.com/gruntjs/grunt-contrib-concat
     * Imports all .js files and appends project banner
     */
    concat: {
      dist: {
        files: {
          '<%= project.app %>/js/scripts.min.js': ['<%= project.src %>/js/jquery.fixto.js','<%= project.src %>/js/jquery.hoverIntent.js','<%= project.src %>/js/jquery.superfish.js','<%= project.src %>/js/main.js']
        }
      },
      options: {
        stripBanners: true,
        nonull: true,
        banner: '<%= tag.banner %>'
      }
    },




    /**
     * Uglify (minify) JavaScript files
     * https://github.com/gruntjs/grunt-contrib-uglify
     * Compresses and minifies all JavaScript files into one
     */
    uglify: {
      options: {
        banner: "<%= tag.banner %>",
        mangle: true
        //compress: true
      },
      dist: {
        files: {
          '<%= project.app %>/js/scripts.min.js' : ['<%= project.src %>/js/app.js']
        }
      }
    },



    /**
     * Compile Sass/SCSS files
     * https://github.com/gruntjs/grunt-contrib-sass
     * Compiles all Sass/SCSS files and appends project banner
     */
    compass: {
      options: {
          sassDir: '<%= project.src %>/sass',
          cssDir: '<%= project.app %>/css',
          specify: ['<%= project.css %>'],
          banner: '<%= tag.banner %>',
          require: 'companimation'
      },
      dev: {
        options: {
          outputStyle: 'compressed'
        }
      },
      dist: {
        options: {
          outputStyle: 'compressed'
        }
      }
    },




    /**
     * Opens the web server in the browser
     * https://github.com/jsoverson/grunt-open
     */
    open : {
      dev : {
        path: 'http://localhost:<%= connect.options.port %>',
        app: 'Google Chrome'
      }
    },


    /**
     * Runs tasks against changed watched files
     * https://github.com/gruntjs/grunt-contrib-watch
     * Watching development files and run concat/compile tasks
     * Livereload the browser once complete
     */
    watch: {
      concat: {
        files: '<%= project.src %>/js/{,*/}*.js',
        tasks: ['concat:dev', 'jshint']
      },
      compass: {
        files: '<%= project.src %>/sass/{,*/}*.{scss,sass}',
        tasks: ['compass:dev']
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '<%= project.app %>/*.html',
          '<%= project.app %>/css/*.css',
          '<%= project.app %>/js/{,*/}*.js',
          '<%= project.app %>/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    }
  });


  /*
  -----------------
  default task
  -----------------
  */

  grunt.registerTask('default', [
    'compass:dev',
    'connect:livereload',
    'open:dev',
    'uglify',
    'watch'
  ]);


  grunt.registerTask('deploy', [
  ]);

};
