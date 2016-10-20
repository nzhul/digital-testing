'use strict'

// Requiring the needed modules that helps us to make our build!
import del from 'del'
import path from 'path'
import gulp from 'gulp'
import cssnano from 'cssnano'
import notifier from 'node-notifier'
import autoprefixer from 'autoprefixer'
import sass from 'gulp-sass'
import util from 'gulp-util'
import size from 'gulp-size'
import cache from 'gulp-cache'
import uglify from 'gulp-uglify'
import eslint from 'gulp-eslint'
import concat from 'gulp-concat'
import rename from 'gulp-rename'
import postcss from 'gulp-postcss'
import imagemin from 'gulp-imagemin'
import stylelint from 'gulp-stylelint'
import sourcemaps from 'gulp-sourcemaps'
import config from './js.json'

// Everthing that need to be deployed on production goes to `build` folder
// These are some glob patters for easy reference
const DEST = './build'
const DEST_CSS = './build/css'
const DEST_IMG = './build/img'

const JS_FILES = './src/js/**/*'
const IMAGE_FILES = './src/img/**/*'
const SASS_FILES = './src/styles/*.scss'
const SASS_FILES_ALL = './src/styles/**/*.scss'

// No need to write css prefixes by hand
// Autoprefixer is a great tool that handles this automatically with minimal configuration
// You could read more about it here `https://github.com/postcss/autoprefixer`
const AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
]

// Notification settings just for fun
// of course you can disable them or just disable the sound
const NOTIFICATION_SETTINGS = {
  sound: true,
  title: 'DEMO_WORKFLOW',
  icon: path.join(__dirname, 'src', 'img', 'js-logo.png')
}

// Some helpers here
// variable to determine whether we are building for development or production
// by default build will be production ready
let failsafe = false
const assign = Object.assign
const separator = '\n' + Array(80).join('=') + '\n'

const log = (...args) => {
  console.log(separator, ...args, separator)
}

const eventlog = (event) => {
  util.log('File', event.path, 'was', event.type, 'running tasks...')
}

const notify = (message) => {
  notifier.notify(assign({}, NOTIFICATION_SETTINGS, { message }))
}

// If you need to copy some files to the build directory
// you can just add them here
const copy = () => {
  gulp.src('./readme.md').pipe(gulp.dest(DEST))
  gulp.src('./package.json').pipe(gulp.dest(DEST))
}

// Optimize and compress images
const images = () => {
  return gulp.src(IMAGE_FILES)
    .pipe(cache(imagemin({ progressive: true, interlaced: true })))
    .pipe(gulp.dest(DEST_IMG))
    .pipe(size({ title: 'images' }))
}

// Compile sass for files, no minification here
// usefull for development
const cssdev = () => {
  let err
  return gulp.src(SASS_FILES)
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expanded' }))
    .on('error', onerror)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(DEST_CSS))
    .pipe(stylelint({ reporters: [{ formatter: 'verbose', console: true }] }))
    .on('error', onerror)
    .on('error', () => { err = true })
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(DEST_CSS))
    .on('finish', () => !err && notify('sass OK'))
}

// Compile sass for files ready for production
// Autoprefixer handles browser prefixes for us here
// CssNano minifies the compiled css => `http://cssnano.co`
// Stylelint reports issues that we might have => `http://stylelint.io`
const cssdist = () => {
  return gulp.src(SASS_FILES)
    .pipe(sass({ outputStyle: 'expanded' }))
    .on('error', onerror)
    .pipe(postcss([ autoprefixer({ browsers: AUTOPREFIXER_BROWSERS, cascade: false }) ]))
    .pipe(gulp.dest(DEST_CSS))
    .pipe(stylelint({ reporters: [{ formatter: 'verbose', console: true }] }))
    .on('error', onerror)
    .pipe(postcss([ cssnano({ zindex: false, normalizeCharset: true }) ]))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(DEST_CSS))
    .pipe(size({ title: 'css' }))
    .pipe(size({ title: 'css gzip', gzip: true }))
}

// We use `eslint` to lint our js code and `eslint-config-standard` here...
// but you can use any configuration you find suitable for your needs.
// For example `eslint-config-google` and `eslint-config-airbnb` are quite good ones in our opinion
// You can even build your own!
// Read more at `http://eslint.org`
const lint = () => {
  return gulp.src([ JS_FILES, './gulpfile.babel.js' ])
    .pipe(eslint())
    .pipe(eslint.results(results => results.warningCount ? notify('eslint warning') : util.noop()))
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
    .on('error', onerror)
}

// `config` here is comming from `js.json` file which describes what bundles we can define
// javascript bundles are minified for production only
const js = (config) => {
  return gulp.src(config.src)
    .pipe(concat(config.filename))
    .pipe(gulp.dest(config.dest))
    .pipe(failsafe ? util.noop() : uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(config.dest))
    .pipe(size({ title: 'js' }))
    .pipe(size({ title: 'js gzip', gzip: true }))
}

const onsuccess = () => {
  log('Build complete!')
  return gulp.src(DEST + '**/*')
    .pipe(size({ title: 'total size' }))
    .pipe(size({ title: 'total size gzip', gzip: true }))
}

const onerror = (error) => {
  log(error.toString())
  notify(error.plugin.replace('gulp-', '').concat(' fails'))
  failsafe ? gulp.emit('end') : process.exit(1)
}

// Our `watch` function
// watching files for changes and execute appropriate tasks
const watch = () => {
  failsafe = true
  gulp.watch(JS_FILES, ['js']).on('change', eventlog)
  gulp.watch(IMAGE_FILES, ['images']).on('change', eventlog)
  gulp.watch(SASS_FILES_ALL, ['css']).on('change', eventlog)
  log('watching now...')
  notify('watching now...')
}

// Gulp Tasks
// Hint no need to install global `gulp` you can run all this tasks with npm scripts
// See `package.json` for more details
gulp.task('dev', ['build'], watch)
gulp.task('default', ['build'], watch)
gulp.task('build', ['clean', 'copy', 'css', 'images', 'js'], onsuccess)

gulp.task('clean', () => del.sync(DEST))
gulp.task('copy', copy)
gulp.task('lint', lint)
gulp.task('images', images)
gulp.task('js', ['lint'], () => js(config.all))
gulp.task('css', () => failsafe ? cssdev() : cssdist())
