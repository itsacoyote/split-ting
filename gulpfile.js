var gulp = require('gulp');
var $ = require('gulp-load-plugins')({ lazy: true });
var rollup = require('gulp-better-rollup');
var del = require('del');

gulp.task('html', function () {
    return gulp.src('src/*.pug')
        .pipe($.pug())
        .pipe(gulp.dest('build/'))
        .pipe($.connect.reload());
});

gulp.task('serve', function () {
    $.connect.server({
        root: 'build/',
        livereload: true
    });
});

gulp.task('images', function () {
    return gulp.src('src/img/')
        .pipe($.imagemin())
        .pipe(gulp.dest('build/img/'))
        .pipe($.connect.reload());
});

gulp.task('styles', function () {
    return gulp.src('src/less/main.less')
        .pipe($.less())
        .pipe(gulp.dest('build/styles/'))
        .pipe($.connect.reload());
});

gulp.task('scripts', function () {
    return gulp.src('src/js/main.js')
        .pipe(rollup({
            plugins: []
        }, {
            file: 'build/js/main.js',
            format: 'iife',
            name: 'umd',
            sourcemap: true
        }))
        .pipe(gulp.dest('build/js'))
        .pipe($.connect.reload());
});

gulp.task('clean', function () {
    return del.sync('build/');
});

gulp.task('watch', function () {
    gulp.watch(['src/*.pug'], ['html']);
    gulp.watch(['src/js/*.js'], ['scripts']);
    gulp.watch(['src/less/*.less'], ['styles']);
});

gulp.task('build', ['html', 'styles', 'images', 'scripts']);

gulp.task('default', [
    'clean',
    'build',
    'watch',
    'serve'
]);
