// MISCELLANEOUS
var gulp = require('gulp');
var concat = require('gulp-concat');
var gzip = require('gulp-gzip');
var del = require('del');
var replace = require('gulp-replace');

// STYLESHEETS
var minify_css = require('gulp-cssnano');
var sass = require('gulp-sass');

// JAVASCRIPTS
var minify_js = require('gulp-uglify');

// IMAGES
var imagemin = require('gulp-imagemin');

// VARIABLES
var cachebust = Date.parse(Date());
var src = {
  stylesheets: 'stylesheets/*.scss',
  javascripts: 'javascripts/*.js',
  images: 'images/*.+(gif|jpg|png|svg)',
  index_html: 'html/index.html',
}
var dest = {
  stylesheets: 'static/stylesheets',
  javascripts: 'static/javascripts',
  images: 'static/images',
  index_html: '',
}
var gzipOptions = {
  append: true,
  skipGrowingFiles: true,
}

// STYLESHEETS
gulp.task('stylesheets', function(){
  gulp.src(src.stylesheets)
  .pipe(concat('stylesheet' + cachebust + '.css'))
  .pipe(sass())
  .pipe(minify_css())
  .pipe(gulp.dest(dest.stylesheets))
  .pipe(gzip(gzipOptions))
  .pipe(gulp.dest(dest.stylesheets));
});


// JAVASCRIPTS
gulp.task('javascripts', function(){
  gulp.src(src.javascripts)
  .pipe(concat('javascript' + cachebust + '.js'))
  .pipe(minify_js())
  .pipe(gulp.dest(dest.javascripts))
  .pipe(gzip(gzipOptions))
  .pipe(gulp.dest(dest.javascripts));
});


// CACHEBUST
gulp.task('cachebust', ['stylesheets', 'javascripts'], function(){
  gulp.src(src.index_html)
  .pipe(concat('index.html'))
  .pipe(replace(/(stylesheet|javascript)\d+/g, '$1' + cachebust))
  .pipe(gulp.dest(dest.index_html));
});


// IMAGES
gulp.task('images', function(){
  gulp.src(src.images)
  .pipe(imagemin())
  .pipe(gulp.dest(dest.images));
});


// PURGE GULP FOLDER
gulp.task('purge', function(){
  del.sync([
    dest.stylesheets,
    dest.javascripts,
  ]);
});

gulp.task('purge_images', function(){
  del.sync([
    dest.images,
  ]);
});


// WATCH
gulp.task('watch', function(){
  gulp.watch([
    src.stylesheets,
    src.javascripts,
    src.index_html,
  ], ['purge', 'cachebust']);
  gulp.watch(src.images, ['purge_images', 'images']);
});


// DEFAULT
gulp.task('default', ['watch']);


// DEBUG
gulp.task('debug', function(){
  console.log('debug');
});
