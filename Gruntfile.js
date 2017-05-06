module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
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

  // Load the plugin that provides the "uglify" task.
  
  grunt.loadNpmTasks('grunt-contrib-compress');

  // Default task(s).
  grunt.registerTask('default', ['compress']);

};