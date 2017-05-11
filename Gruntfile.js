module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    less: {
      production: {
        options: {
          path: ['css']
        },
        files: {
          'css/popup.css':'less/popup.less'
        }
      }
    },

    compress: {
      main: {
        options: {
          archive: 'oldPackages/<%= pkg.short %><%= pkg.version %>.zip'
        },
        files: [
          {src: ['_locales/**'], dest: './'},
          {src: ['css/*'], dest: './'},
          {src: ['img/*'], dest: './'},
          {src: ['js/*'], dest: './'},
          {src: ['sounds/*'], dest: './'},
          {src: ['manifest.json'], dest: './'},
          {src: ['options.html'], dest: './'},
          {src: ['popup.html'], dest: './'},
        ]
      }
    }

  });
  
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-less');

  // Default task(s).
  grunt.registerTask('default', ['compress']);

};