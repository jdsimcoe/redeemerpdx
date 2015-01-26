
// ================================================
// + ATHEY CREEK -- Gulp Configuration
// ================================================


// ------------------------------------------------
// + GULP PLUGINS
// ------------------------------------------------

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCSS = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    gulpif = require('gulp-if');

// ------------------------------------------------
// + ERROR HANDLING FOR GULP PLUMBER
// ------------------------------------------------

var onError = function(err) {
  console.log(err);
}

// ------------------------------------------------
// + NODE PLUGINS
// ------------------------------------------------

var neat = require('node-neat').includePaths,
    fontcustom = require('fontcustom');

// ------------------------------------------------
// + VARIABLES & PATHS
// ------------------------------------------------

var repo = 'https://github.com/redeemerpdx/redeemerpdx.com';
var source_path = 'assets/source';
var build_path = 'assets/build';
var bower_path = 'bower_components';
var paths = {
  styles: [
    source_path + '/styles/redeemer.scss'
  ],
  scripts: [
    bower_path + '/jquery/dist/jquery.js',
    bower_path + '/fastclick/lib/fastclick.js',
    bower_path + '/snapjs/snap.js',
    bower_path + '/fitvids/*fitvids.js',
    bower_path + '/sharrre/*sharrre.js',
    source_path + '/scripts/main.js'
  ],
  images: [
    source_path + '/images/*.*'
  ],
  clean: [
    build_path + '/styles/',
    build_path + '/scripts/',
    build_path + '/images/'
  ]
};

// ------------------------------------------------
// + HTML
// + - renames XSL files to HTML
// ------------------------------------------------

// gulp.task('html_clean', function() {
//   return gulp.src('./html')
//     .pipe(clean())
// });

// ------------------------------------------------
// + STYLES
// + - handles compiling & minifying of SCSS
// ------------------------------------------------

gulp.task('styles', function() {
  return gulp.src(paths.styles)
    .pipe(sass( { includePaths: ['styles'].concat(neat) } ))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifyCSS())
    .pipe(gulp.dest(build_path + '/styles'))
});


// ------------------------------------------------
// + SCRIPTS
// + - handles compiling, concat & minifying JS
// ------------------------------------------------

gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest(build_path + '/scripts'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest(build_path + '/scripts'))
});


// ------------------------------------------------
// + IMAGES
// + - optimizes image files on the site
// ------------------------------------------------

gulp.task('images', function() {
  return gulp.src(paths.images)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(gulp.dest(build_path + '/images'))
});


// ------------------------------------------------
// + FONTS
// + - moves any font assets to the build folder
// ------------------------------------------------

// gulp.task('fonts', function() {
//   return gulp.src(paths.fonts)
//     .pipe(plumber({
//       errorHandler: onError
//     }))
//     .pipe(gulp.dest(build_path + '/fonts'))
// });


// ------------------------------------------------
// + CLEAN
// + - Cleans out the build folder
// ------------------------------------------------

gulp.task('clean', function() {
  return gulp.src(paths.clean, {read: false})
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(clean())
    .pipe(notify({
      "message": "CSS cleaned",
      "sound": "Hero",
      "open": repo
    }));
});


// ------------------------------------------------
// + ICONS
// + - builds a custom icon font from SVG files
// ------------------------------------------------

gulp.task("icons", function() {
  return fontcustom({
    "config": './fontcustom.yml',
    "noisy": true
  });
});


// ------------------------------------------------
// + DEFAULT
// + - cleans, builds, and then watches for changes
// ------------------------------------------------

gulp.task('default', ['clean'], function() {
  gulp.start('styles', 'scripts', 'images', 'watch');
});


// ------------------------------------------------
// + WATCH
// + - waiting for changes & LiveReload magic
// ------------------------------------------------

gulp.task('watch', function() {
  gulp.watch(source_path + '/styles/**/*.scss', ['styles']);
  gulp.watch(source_path + '/scripts/**/*.js', ['scripts']);
  gulp.watch(source_path + '/images/*.*', ['images']);
  var server = livereload();

  gulp.watch([build_path + '/**']).on('change', function(file) {
    server.changed(file.path);
  });
});
