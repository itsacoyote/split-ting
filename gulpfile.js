var gulp = require('gulp');
var $ = require('gulp-load-plugins')({ lazy: true });
var rollup = require('gulp-better-rollup');
var babel = require('rollup-plugin-babel');
var commonjs = require('rollup-plugin-commonjs');
var resolve = require('rollup-plugin-node-resolve');
var legacy = require('rollup-plugin-legacy');
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
    return gulp.src('src/img/*')
        .pipe($.imagemin())
        .pipe(gulp.dest('build/img/'))
        .pipe($.connect.reload());
});

gulp.task('styles', function () {
    return gulp.src([
        './node_modules/tippy.js/dist/tippy.css',
        './src/less/main.less'
    ])
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.concat('main.css'))
        .pipe($.less())
        .pipe($.autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe($.sourcemaps.write('../maps'))
        .pipe(gulp.dest('build/styles/'))
        .pipe($.connect.reload());
});

gulp.task('scripts', function () {
    return gulp.src('src/js/main.js')
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe(rollup({
            plugins: [
                resolve({
                    jsnext: true,
                    main: true,
                    browser: true
                }),
                commonjs(),
                legacy({
                    './node_modules/blissfuljs/bliss.js': {
                        '$': '$',
                        '$$': '$$'
                    }
                }),
                babel({
                    exclude: 'node_modules/**'
                })
            ]
        }, {
            file: 'build/js/main.js',
            format: 'iife',
            sourcemap: true
        }))
        .pipe($.sourcemaps.write('../maps'))
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
