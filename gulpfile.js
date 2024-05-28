'use strict';

var gulp = require('gulp');
var pug = require('gulp-pug');
var del = require('del');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var rigger = require('gulp-rigger');
var uglify = require('gulp-uglify');
var path = require('path');
var plumber = require('gulp-plumber');
var data = require('gulp-data');
var fs = require('fs');
var rename = require('gulp-rename');
var less = require('gulp-less');
var webp = require('gulp-webp');
// var path = require("path");

gulp.task('pug', function () {
  return gulp
    .src('src/*.pug')
    .pipe(
      data(function (file) {
        return JSON.parse(fs.readFileSync('src/assets/data/data.json'));
      })
    )
    .pipe(
      pug({
        pretty: true,
      })
    )
    .pipe(gulp.dest('build'));
});

gulp.task('less', function () {
  return gulp
    .src('src/assets/less/app.less')
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/assets/css/'));
});



var vendorsCssFiles = [
  'src/assets/vendors/sweetalert.css',
  'src/assets/vendors/nouislider.min.css',
  'src/assets/vendors/swiper-bundle.min.css',
  'src/assets/vendors/fancybox4/ui/dist/fancybox.css',
  'src/assets/vendors/bootstrap.css',
  // 'src/assets/libs/bootstrap5/mod/bootstrap.min.css',
  //'src/assets/libs/bootstrap-icons.css',
];

gulp.task('vendorsCss', function () {
  return (
    gulp
      .src(vendorsCssFiles, { base: 'assets/css' })
      // .pipe(rigger()) //Прогоним через rigger

      .pipe(sourcemaps.init()) //Инициализируем sourcemap
      .pipe(concatCss('vendors.css'))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('build/assets/css'))
  );
});

gulp.task('image', function () {
  return (
    gulp
      .src('src/assets/img/**/*.*') //Выберем наши картинки
      // .pipe(
      // 	imagemin({
      // 		//Сожмем их
      // 		progressive: true,
      // 		svgoPlugins: [{ removeViewBox: false }],
      // 		use: [pngquant()],
      // 		// interlaced: true,
      // 	})
      // )
      .pipe(gulp.dest('build/assets/img'))
  );
});

gulp.task('webp', function () {
  return gulp
    .src('src/assets/img/**/*.*', { base: './' })
    .pipe(webp({ quality: 60, method: 6 }))
    .pipe(gulp.dest('build/assets/webpimg'));
});

var vendorsJsFiles = [
  'src/assets/vendors/jquery.min.js',
  // "src/assets/vendors/bootstrap.min.js",
  // 'src/assets/libs/bootstrap5/dist/js/bootstrap.min.js',
  'src/assets/vendors/jquery.fancybox.min.js',
  // 'src/assets/vendors/fancybox4/ui/dist/fancybox.umd.js',
  'src/assets/vendors/jquery.maskedinput.js',
  'src/assets/vendors/sweetalert.min.js',
  'src/assets/vendors/swiper-bundle.min.js',
];

gulp.task('vendorsJs', function () {
  return (
    gulp
      .src(vendorsJsFiles, { base: 'assets/js' })
      // .pipe(rigger()) //Прогоним через rigger
      .pipe(plumber())
      .pipe(sourcemaps.init()) //Инициализируем sourcemap
      .pipe(concat('vendors.js'))
      .pipe(uglify()) //Сожмем наш js
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('build/assets/js'))
  );
});

var myjsfiles = [
  'src/assets/js/__main.js',

  'src/assets/js/__resize.js',
];

gulp.task('myJs', function () {
  return (
    gulp
      .src(myjsfiles, { base: 'assets/js' })
      .pipe(plumber())
      .pipe(sourcemaps.init()) //Инициализируем sourcemap
      .pipe(concat('app.js')) // в какой файл объединить
      // .pipe(uglify()) //Сожмем наш js
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('build/assets/js'))
  );
});

gulp.task('fonts', function () {
  return gulp
    .src('src/assets/fonts/**/*.*')
    .pipe(gulp.dest('build/assets/fonts'));
});

// gulp.task('bicons', function () {
//   return gulp
//     .src('src/assets/libs/bootstrap-icons.css')
//     .pipe(gulp.dest('build/assets/css'));
// });

// gulp.task('icomoon', function () {
//   return gulp
//     .src('src/assets/icomoon/**/*.*')
//     .pipe(gulp.dest('build/btlclinic/icomoon'));
// });

// gulp.task('video', function () {
//   return gulp
//     .src('src/assets/video/**/*.*')
//     .pipe(gulp.dest('build/assets/video'));
// });

gulp.task('clean', function () {
  return del('build');
});

gulp.task(
  'build',
  gulp.series(
    'clean',
    gulp.parallel(
      'css',
      'vendorsCss',
      'pug',
      'image',
      'vendorsJs',
      'myJs',
      'icomoon',
      'fonts'
      // 'video',
    )
  )
);

gulp.task('watch', function () {
  gulp
    .watch('src/assets/less/*.less*', gulp.series('less'))
    .on('uplink', function (filepath) {
      remember.forget('less', path.resolve(filepath));
      delete cached.caches.styles[path.resolve(filepath)];
    });
  gulp
    .watch('src/assets/img/**/*.*', gulp.series('image'))
    .on('uplink', function (filepath) {
      remember.forget('image', path.resolve(filepath));
      delete cached.caches.image[path.resolve(filepath)];
    });
  gulp
    .watch('src/assets/js/*.js*', gulp.series('myJs'))
    .on('uplink', function (filepath) {
      remember.forget('myJs', path.resolve(filepath));
      delete cached.caches.myJs[path.resolve(filepath)];
    });
  gulp.watch('src/**/*.pug', gulp.series('pug'));
});

gulp.task('dev', gulp.series('build', 'watch'));
