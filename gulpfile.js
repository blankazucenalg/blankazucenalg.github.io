/**
 *  Welcome to your gulpfile!
 *  The gulp tasks are split into several files in the gulp directory
 *  because putting it all here was too long
 */

'use strict';

var gulp = require('gulp');
var klawSync = require('klaw-sync')
var paths = klawSync('./gulp')

/**
 *  This will load all js or coffee files in the gulp directory
 *  in order to load all gulp tasks
 */
paths.filter(function(file) {
  return (/\.(js|coffee)$/i).test(file.path);
}).map(function(file) {
  require(file.path);
});

/**
 *  Default task clean temporaries directories and launch the
 *  main optimization build task
 */
gulp.task('default', ['clean'], function () {
  gulp.start('build');
});
