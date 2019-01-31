var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var spritesmith = require('gulp.spritesmith');
var merge = require ('merge-stream');
var cssnano = require ('gulp-cssnano');

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
});

// concat js

gulp.task('scripts', function() {
  return gulp.src([
  'app/js/libs/jquery-3.3.1.min.js',
  'app/js/libs/owl.carousel.min.js',
  'app/js/libs/jquery.mixitup.js',
  'app/js/libs/popper.min.js',
  'app/js/libs/bootstrap.min.js',
  'app/js/libs/common.js'
  ])
    .pipe(concat('all.js'))
    .pipe(gulp.dest('app/js/build/'));
});

// concat css

gulp.task('concat-css', function () {

  return gulp.src([
        'app/css/libs/*.css',
        'app/css/reset.css',
        'app/css/main.css',
        'app/css/components/*.css',
        'app/css/assets/*.css'
    ])
    .pipe(concatCss("all.css"))
    .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
    .pipe(gulp.dest('app/css/'));
});

// sprites

gulp.task('sprite', function () {
    let spriteData = gulp.src('app/img/icons/*.png')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.css',
            imgPath: '../../img/sprite.png'
        }));

    let imgStream = spriteData.img
        .pipe(gulp.dest('app/img'));

    let cssStream = spriteData.css
        .pipe(gulp.dest('app/css/components/'));
    return merge(imgStream, cssStream);
})

//min

gulp.task('css-min', function() {
    return gulp.src('app/css/all.css')
    .pipe(cssnano())
    .pipe(gulp.dest('app/css/'))
});


//build
gulp.task('build', ['css-min'], function() {
    var buildCss = gulp.src([
            'app/css/reset.css',
            'app/css/main.css',
            'app/css/all.css'
        ])
    .pipe(gulp.dest('dist/css'));

    var buildFonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));

    var buildImg = gulp.src('app/img/**/*')
    .pipe(gulp.dest('dist/img'));

    var buildJs = gulp.src([
            'app/js/build/all.js',
            'app/js/common.js'
        ])
    .pipe(gulp.dest('dist/js'));

    var buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));

});

// gulp watch
gulp.task('watch', ['browser-sync', 'scripts', 'concat-css', 'sprite'], function() {
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/css/**/*.css', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
    gulp.watch('app/css/**/*.css', ['concat-css']);
    gulp.watch('app/img/icons/*.png', ['sprite']);
});

gulp.task('default', ['watch']);