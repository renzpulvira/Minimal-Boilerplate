// If you don't know what this is
// or you can't read javascript. (and i suggest you learn it)
// This file save your ass some time i guess.
var gulp = require('gulp');
var sass = require('gulp-sass');
var bs = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var cssnano = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');

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

gulp.task('babel', done => {
  gulp.src('assets/js/main.js')
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(rename(function(path){
      path.basename = 'index';
    }))
    .pipe(gulp.dest('./assets/js/dist/'))
  done();
})

gulp.task('sass', done => {
  return gulp.src('assets/scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('assets/css'))
    // Remove Commenet for Production
    // .pipe(rename({ suffix: '.min' }))
    // .pipe(cssnano())
    // .pipe(gulp.dest('stylesheets'))
    .pipe(bs.reload({
      stream: true
    }))

  done();
});

gulp.task('browserSync', done => {
  bs.init({
    server: {
      baseDir: './',
    },
    online: true,
    tunnel: 'liveshare',
    cors: true,
  })
  done();
})

gulp.task('watch', gulp.series('browserSync', 'sass', 'babel', function (){
  gulp.watch('assets/scss/include/*.scss', gulp.series('sass'));
  gulp.watch('assets/scss/pages/*.scss', gulp.series('sass'));
  gulp.watch('assets/scss/*.scss', gulp.series('sass'));
  gulp.watch('*.html').on('change', bs.reload);
  gulp.watch('assets/js/*.js', gulp.series('babel')).on('reload', bs.reload);
}));



