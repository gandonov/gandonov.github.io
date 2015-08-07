module.exports = function (grunt) {
    grunt.initConfig({

    // define source files and their destinations
    uglify: { tests: { src: [ 'js/*.js' ], dest: 'jsm/aw-ui-framework.min.js' } },
    watch: {
        js:  { files: 'js/*.js', tasks: [ 'uglify' ] },
    }
});

// load plugins
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-uglify');

// register at least this one task
grunt.registerTask('default', [ 'uglify' ]);


};