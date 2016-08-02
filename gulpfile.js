
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');
var useref = require('gulp-useref');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var cssnano = require('gulp-cssnano');

gulp.task('sass', function(){
  return gulp.src('icbf_fe/includes/*.scss')
    .pipe(sass()) 
    .pipe(gulp.dest('icbf_fe/includes/'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'icbf_fe'
    },
  })
});

gulp.task('prefixear', function () {
  return gulp.src('icbf_fe/includes/css-main.css')
    .pipe(autoprefixer({
      browsers: ['last 3 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('icbf_dist/includes/'));
});

gulp.task('useref', function(){
  return gulp.src('icbf_fe/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('icbf_dist'));
}); 

gulp.task('images', function(){
  return gulp.src('icbf_fe/media/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(cache(imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest('icbf_dist/media'))
});

gulp.task('copyincludes', function(){
  return gulp.src(['icbf_fe/includes/js-modernizr.js',
    'icbf_fe/includes/js-main.js',
    'icbf_fe/includes/css-main.css',
    'includes/js-jquery.js'  ])
    .pipe($.copy('icbf_dist/includes'));
});


/* =================================
MAIN WATCH TASK 
==================================== */
gulp.task('watch', ['browserSync', 'sass'], function(){
  gulp.watch('icbf_fe/**/*.scss', ['sass']);
  gulp.watch('icbf_fe/*.html', browserSync.reload); 
  gulp.watch('icbf_fe/includes/**/*.js', browserSync.reload);
});


/* =================================
MAIN BUILD TASK 
==================================== */
gulp.task('build', [`copyincludes`, `prefixear`, `useref`, `images`], function (){
  console.log('Building files');
});


