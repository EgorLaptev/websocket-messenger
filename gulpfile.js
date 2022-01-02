'use strict';

const { watch, dest, src, parallel }  = require('gulp');
const rename                = require('gulp-rename');
const rimraf                = require('rimraf');
const stylus                = require('gulp-stylus');
const prefix                = require('gulp-autoprefixer');
const minify                = require('gulp-minify-css');
const sourcemaps            = require('gulp-sourcemaps');
const rigger                = require('gulp-rigger');

const path = {
    src: {
        css: 'src/stylus/**/*.styl',
        html: 'src/templates/*.html'
    },
    build: {
        css: 'build/assets/css',
        html: 'build'
    },
    watch: {
        css: 'src/stylus/**/*.styl',
        html: 'src/templates/**/*.html'
    },
    clean: 'build'
}

function build_css() {
    return src(path.src.css)
        .pipe(sourcemaps.init())
        .pipe(stylus())
        .pipe(prefix())
        .pipe(dest(path.build.css))
        .pipe(minify())
        .pipe(sourcemaps.write())
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest(path.build.css));
}

function build_html() {
    return src(path.src.html)
        .pipe(rigger())
        .pipe(dest(path.build.html));
}

function build(cb) {
    build_css();
    build_html();
    cb();
}

function clear(cb) {
    rimraf(path.clean, {}, cb);
}

function build_watch () {
    watch(path.watch.css, { ignoreInitial: false }, build_css);
    watch(path.watch.html, { ignoreInitial: false }, build_html);
}

exports.watch   = build_watch;
exports.build   = build;
exports.clear   = clear;