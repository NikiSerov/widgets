const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const gcmq = require('gulp-group-css-media-queries');
const plumber = require('gulp-plumber');
const concatCss = require('gulp-concat-css');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglyfly = require('gulp-uglify-es').default;
const cachebust = require('gulp-cache-bust');

//CSS

const buildSass = () => {
  return src('src/sass/*.scss')
    .pipe(sass({ errLogToConsole: true }))
    .pipe(gcmq())
    .pipe(plumber())
    .pipe(dest('src/css'))
}

const buildCss = () => {
  return src('src/css/*.css')
    .pipe(concatCss('styles/styles.css'))
    .pipe(autoprefixer())
    .pipe(cleanCss({level: 2}))
    .pipe(dest('build'))
    .pipe(browserSync.reload({ stream: true }));
}

//JS

const buildJs = () => {
  return src('src/js/*.js')
    .pipe(concat('js/scripts.js'))
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(uglyfly())
    .pipe(dest('build'))
    .pipe(browserSync.reload({ stream: true }));
}

//HTML

const buildHtml = () => {
  return src('src/*.html')
    .pipe(cachebust({
      type: 'timestamp'
    }))
    .pipe(dest('build'))
    .pipe(browserSync.reload({ stream: true }));
}

//icons

const moveIcons = () => {
  return src('src/icons/*')
    .pipe(dest('build/icons'))
    .pipe(browserSync.reload({ stream: true }))
}

//browserSyncJob

const browserSyncJob = () => {
  browserSync.init({
    server: "build/",
    port: 3000,
    open: true,
    notify: false
  });

  watch('src/*.html', buildHtml);
  watch('src/sass/*.scss', buildSass);
  watch('src/css/*.css', buildCss);
  watch('src/js/*.js', buildJs);
  watch('src/images/*', moveImages);
  watch('src/icons/*', moveIcons);
}

//production build

const build = series(buildHtml, buildSass, buildCss, buildJs, moveImages, moveIcons);

//prod compile

exports.default = series(build, browserSyncJob);
