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
        html: 'src/templates/*.html',
        fonts: 'src/media/fonts/**/*.ttf',
        img: 'src/media/images/*',
    },
    build: {
        css: 'build/assets/css',
        html: 'build',
        fonts: 'build/assets/media/fonts',
        img: 'build/assets/media/images'
    },
    watch: {
        css: 'src/stylus/**/*.styl',
        html: 'src/templates/**/*.html',
        fonts: 'src/media/fonts/**/*',
        img: 'src/media/images/**/*'
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

function build_fonts() {
    return src(path.src.fonts)
        .pipe(dest(path.build.fonts));
}

function build_images() {
    return src(path.src.img)
        .pipe(dest(path.build.img))
}

function build(cb) {
    build_css();
    build_html();
    build_fonts();
    build_images();
    cb();
}

function clear(cb) {
    rimraf(path.clean, {}, cb);
}

function build_watch () {
    watch(path.watch.css, { ignoreInitial: false }, build_css);
    watch(path.watch.html, { ignoreInitial: false }, build_html);
    watch(path.watch.fonts, { ignoreInitial: false }, build_fonts);
    watch(path.watch.img, { ignoreInitial: false }, build_images);
}

exports.default = build;
exports.build   = build;
exports.clear   = clear;
exports.watch   = build_watch;
