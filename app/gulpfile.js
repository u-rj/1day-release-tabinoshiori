var browserify = require('browserify'),
  gulp = require('gulp'),
  sourcemaps = require('gulp-sourcemaps'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  browserSync = require('browser-sync'),
  combineMq = require('gulp-combine-mq'),
  notify = require("gulp-notify"),
  plumber = require('gulp-plumber');

var entryPoint = './src/js/script.js',
  browserDir = './dist',
  sassWatchPath = './src/scss/**/*.scss',
  jsWatchPath = './src/**/*.js',
  htmlWatchPath = './src/**/*.html';

gulp.task('html', function() {
  gulp.src(htmlWatchPath)
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('js', function () {
  return browserify(entryPoint, {debug: true, extensions: ['es6']})
    .transform("babelify", {presets: ["es2015"]})
    .bundle()
    .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
    .pipe(source('js/script.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function () {
  const config = {
    server: {baseDir: browserDir}
  };

  return browserSync(config);
});

gulp.task('sass', function () {
  return gulp.src(sassWatchPath)
    .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 1 version', 'iOS >= 8.1', 'Android >= 4.4'],
      cascade: false
    }))
    .pipe(combineMq({
      beautify: false
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/css/'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', function () {
  gulp.watch(jsWatchPath, ['js']);
  gulp.watch(sassWatchPath, ['sass']);
  gulp.watch(htmlWatchPath, ['html']);
  browserSync.reload({stream: true});
});

gulp.task('default', ['html', 'js', 'sass', 'watch', 'browser-sync']);
