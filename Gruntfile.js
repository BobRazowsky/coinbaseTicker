module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    copy: {
      main: {
        files: [
          {expand: true, src: ['*.html'], dest: 'cbt_release/'},
          {expand: true, src: ['img/*'], dest: 'cbt_release/'},
          {expand: true, src: ['css/bootstrap.min.css'], dest: 'cbt_release/'},
          {expand: true, src: ['_locales/**'], dest: 'cbt_release/'},
          {expand: true, src: ['sounds/*'], dest: 'cbt_release/'},
          {expand: true, src: ['vendors/*'], dest: 'cbt_release/'},
          {expand: true, src: ['manifest.json'], dest: 'cbt_release/'}
        ]
      }
    },

    less: {
      production: {
        options: {
          path: ['css']
        },
        files: {
          'cbt_release/css/popup.css':'less/popup.less'
        }
      }
    },

    uglify: {
      main: {
        files: [
          {
              expand: true,
              src: 'js/*.js',
              dest: 'cbt_release/'
          },
          {
              expand: true,
              src: 'vendors/*.js',
              dest: 'cbt_release/'
          }
        ]
      }
    },

    compress: {
      main: {
        options: {
          archive: 'oldPackages/<%= pkg.short %><%= pkg.version %>.zip'
        },
        files: [
          {src: ['cbt_release/**'], dest: '/'}
        ]
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task(s).
  grunt.registerTask('default', ['less']);
  grunt.registerTask('build', ['copy', 'uglify', 'less']);
  grunt.registerTask('pack', ['compress']);
  grunt.registerTask('release', ['copy', 'uglify', 'less', 'compress']);
};