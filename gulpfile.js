// If you don't know what this is
// or you can't read javascript. (and i suggest you learn it)
// This file save your ass some time i guess.
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var cssnano = require('gulp-cssnano');

var plumber = require('gulp-plumber');
var gutil = require('gulp-util');

var gulp_src = gulp.src;
gulp.src = function () {
  return gulp_src.apply(gulp, arguments)
  .pipe(plumber(function (error) {
    gutil.log(gutil.colors.red('Error (' + error.plugin + '): ' + error.message));
    this.emit('end');
  })
  );
};

gulp.task('sass', function(){
  return gulp.src('stylesheets/main.scss')
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 version', 'safari 5', 'ie 6', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
      cascade: false
    }))
    .pipe(gulp.dest('stylesheets'))
    // .pipe(rename({ suffix: '.min' }))
    // .pipe(cssnano())
    // .pipe(gulp.dest('stylesheets'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: '.'
    },
    cors: true,
  })
})

gulp.task('watch', ['browserSync', 'sass'], function (){
    gulp.watch('stylesheets/base/*.scss', ['sass']);
    gulp.watch('stylesheets/components/*.scss', ['sass']);
    gulp.watch('stylesheets/layout/*.scss', ['sass']);
    gulp.watch('stylesheets/pages/*.scss', ['sass']);
    gulp.watch('stylesheets/themes/*.scss', ['sass']);
    gulp.watch('stylesheets/utils/*.scss', ['sass']);
    gulp.watch('stylesheets/vendors/*.scss', ['sass']);
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('javascripts/modules/*.js', browserSync.reload);
    // Other watchers
});