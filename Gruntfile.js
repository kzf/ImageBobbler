'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['src/app.js'],
        dest: 'compiled/js/app.js'
      },
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/js/<%= pkg.name %>.min.js'
      },
      bower: {
        files: {
          'lib/_bower.min.js': ['lib/_bower.js']
        }
      }
    },
    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: 'style',
          src: ['*.scss'],
          dest: 'compiled/style',
          ext: '.css'
        }]
      }
    },
    cssmin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'compiled/style',
          src: ['*.css', '!*.min.css'],
          dest: 'dist/style',
          ext: '.min.css'
        }]
      },
      bower: {
        files: [{
          expand: true,
          cwd: 'lib',
          src: ['_bower.css'],
          dest: 'lib',
          ext: '.min.css'
        }]
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    jshint: {
      options: {
        force: true
      },
      gruntfile: {
        options: {
          jshintrc: '.jshintrc',
        },
        src: 'Gruntfile.js'
      },
      src: {
        options: {
          jshintrc: 'src/.jshintrc',
        },
        src: ['src/**/*.js']
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc',
        },
        src: ['test/**/*.js']
      },
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src', 'qunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'qunit']
      },
      js: {
        files: 'src/*.js',
        tasks: ['concat:dist', 'uglify:dist']
      },
      sass: {
        files: 'style/*.scss',
        tasks: ['sass']
      },
    },
    bower_concat: {
      all: {
        dest: 'lib/_bower.js',
        cssDest: 'lib/_bower.css',
        exclude: [
          'qunit'
        ],
        mainFiles: {
          'jquery-ui': ['themes/flick/jquery-ui.min.css', 'themes/flick/theme.css', 'jquery-ui.min.js']
        }
      }
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bower-concat');

  // Default task.
  grunt.registerTask('default', ['jshint', 'sass', 'bower_concat', 'cssmin', 'concat', 'uglify']);

};
