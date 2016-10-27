'use strict'

// Requiring the needed modules that helps us to make our build!
import del from 'del'
import path from 'path'
import gulp from 'gulp'
import crypto from 'crypto'
import webpack from 'webpack'
import cssnano from 'cssnano'
import mqpacker from 'css-mqpacker'
import notifier from 'node-notifier'
import autoprefixer from 'autoprefixer'
import util from 'gulp-util'
import size from 'gulp-size'
import cache from 'gulp-cache'
// import uglify from 'gulp-uglify'
import eslint from 'gulp-eslint'
import concat from 'gulp-concat'
import rename from 'gulp-rename'
import stylus from 'gulp-stylus'
import flatmap from 'gulp-flatmap'
import replace from 'gulp-replace'
import postcss from 'gulp-postcss'
import iconfont from 'gulp-iconfont'
import imagemin from 'gulp-imagemin'
import stylelint from 'gulp-stylelint'
import sourcemaps from 'gulp-sourcemaps'
import consolidate from 'gulp-consolidate'
import config from './webpack.config'

// Everthing that need to be deployed on production goes to `build` folder
// These are some glob patters for easy reference
const DEST = './build'
const DEST_CSS = './build/css'
const DEST_IMG = './build/img'
// const DEST_DOCS = './build/docs'
const DEST_DOCS_VIEWS = './build/docs/views'
const DEST_ICONFONT = './build/iconfont'

const JS_FILES = './src/js/**/*'
const HTML_FILES = './src/*.html'
const HTML_VIEWS = './src/views/*.html'
const HTML_TEMPLATE = './src/index.html'
const IMAGE_FILES = './src/img/**/*'
const STYLUS_FILES = './src/styles/*.styl'
const STYLUS_FILES_ALL = './src/styles/**/*.styl'

const ICONFONT_SVG_FILES = './src/iconfont/**/*.svg'
const ICONFONT_CSS_FILE = './src/iconfont/_lambda-icon-font.css'
const ICONFONT_HTML_FILE = './src/iconfont/_lambda-icon-font.html'

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
  title: 'λ Lambda',
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
  log(message)
  notifier.notify(assign({}, NOTIFICATION_SETTINGS, { message }))
}

// If you need to copy some files to the build directory
// you can just add them here
const copy = () => {
  gulp.src('./readme.md').pipe(gulp.dest(DEST))
  gulp.src('./package.json').pipe(gulp.dest(DEST))
  gulp.src('./src/favicon.ico').pipe(gulp.dest(DEST))
  gulp.src('./src/js/kendo.all.min.js').pipe(gulp.dest(DEST + '/js'))
  gulp.src('./bower_components/**/*', { base: './' }).pipe(gulp.dest(DEST))
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
  return gulp.src(STYLUS_FILES)
    .pipe(sourcemaps.init())
    .pipe(stylus({ 'include css': true }))
    .on('error', onerror)
    .pipe(sourcemaps.write())
    .pipe(postcss([ autoprefixer({ cascade: false }) ]))
    .pipe(rename({ suffix: `-${config.version}` }))
    .pipe(gulp.dest(DEST_CSS))
    //.pipe(stylelint({ reporters: [{ formatter: 'verbose', console: true }] }))
    .on('error', onerror)
    .on('error', () => { err = true })
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(DEST_CSS))
    .on('finish', () => !err && notify('stylus OK'))
}

// Compile sass for files ready for production
// Autoprefixer handles browser prefixes for us here
// CssNano minifies the compiled css => `http://cssnano.co`
// Stylelint reports issues that we might have => `http://stylelint.io`
const cssdist = () => {
  return gulp.src(STYLUS_FILES)
    .pipe(stylus({ 'include css': true }))
    .on('error', onerror)
    .pipe(postcss([ autoprefixer({ browsers: AUTOPREFIXER_BROWSERS, cascade: false }), mqpacker() ]))
    .pipe(rename({ suffix: `-${config.version}` }))
    .pipe(gulp.dest(DEST_CSS))
    //.pipe(stylelint({ reporters: [{ formatter: 'verbose', console: true }] }))
    .on('error', onerror)
    .pipe(postcss([ cssnano({ zindex: false, normalizeCharset: true }) ]))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(DEST_CSS))
    .pipe(size({ title: 'css' }))
    .pipe(size({ title: 'css gzip', gzip: true }))
}

// Handle icon font
const font = {
  hash: '',
  className: '-i',
  fontPath: 'iconfont',
  fontName: 'lambda-icon-font',

  once() {
    gulp.tasks['css'].dep = []
  },

  create() {
    return gulp.src(ICONFONT_SVG_FILES)
      .pipe(cache(imagemin()))
      .pipe(iconfont({ normalize: true, fontName: font.fontName, appendUnicode: false, formats: ['ttf', 'svg', 'eot', 'woff', 'woff2'], startUnicode: 0x00b1 }))
      .on('glyphs', (glyphs) => { font.glyphs = glyphs })
      .pipe(rename({ suffix: `-${font.hash}` }))
      .pipe(gulp.dest(DEST_ICONFONT))
  },

  invalidate() {
    return gulp.src(ICONFONT_SVG_FILES)
      .pipe(cache(imagemin()))
      .pipe(concat('sprite.svg'))
      .pipe(util.buffer())
      .on('data', (files) => { font.hash = crypto.createHash('md5').update(files[0]._contents).digest('hex').slice(0, 10) })
  },

  css() {
    return gulp.src(ICONFONT_CSS_FILE)
      .pipe(consolidate('lodash', font))
      .pipe(rename({ extname: '.styl' }))
      .pipe(gulp.dest('./src/styles/modules/'))
  },

  html() {
    return gulp.src(ICONFONT_HTML_FILE)
      .pipe(consolidate('lodash', font))
      .pipe(rename({ basename: font.fontName }))
      .pipe(gulp.dest(DEST_DOCS_VIEWS))
  }
}

// We use `eslint` to lint our js code and `eslint-config-standard` here...
// but you can use any configuration you find suitable for your needs.
// For example `eslint-config-google` and `eslint-config-airbnb` are quite good ones in our opinion
// You can even build your own!
// Read more at `http://eslint.org`
const lint = () => {
  return gulp.src([ JS_FILES, './gulpfile.babel.js', './webpack.config.js' ])
    .pipe(eslint())
    .pipe(eslint.results(results => results.warningCount ? notify('eslint warning') : util.noop()))
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
    .on('error', onerror)
}

// WEBPACK
const js = (done) => {
  webpack(failsafe ? config.dev : config.dist, (err, stats) => {
    if (err) throw new Error('webpack error', err)
    log('webpack', stats.toString({ colors: true, progress: true }))
    done()
  })
}

const html = () => {
  return gulp.src(HTML_FILES)
    .pipe(replace('{{version}}', config.version))
    .pipe(gulp.dest(DEST))
}

const render = (template, view) => {
  let name = path.basename(view.path, '.html')
  let content = view.contents.toString('utf8')
  return gulp.src(template)
    .pipe(replace('{{version}}', config.version))
    .pipe(replace('{{views}}', content))
    .pipe(rename({ basename: name }))
    .pipe(gulp.dest(DEST))
}

const views = () => {
  return gulp.src(HTML_VIEWS)
    .pipe(flatmap((stream, file) => render(HTML_TEMPLATE, file)))
    .on('finish', () => log('views OK'))
}


const onsuccess = () => {
  log('Build complete!')
  return gulp.src(DEST + '**/*')
    .pipe(size({ title: 'total size' }))
    .pipe(size({ title: 'total size gzip', gzip: true }))
}

const onerror = function onerror(error) {
  log(error.toString())
  notify(error.plugin.replace('gulp-', '').concat(' fails'))
  failsafe ? this.emit('end') : process.exit(1)
}

// Our `watch` function
// watching files for changes and execute appropriate tasks
const watch = () => {
  failsafe = true
  gulp.watch(JS_FILES, ['js']).on('change', eventlog)
  // gulp.watch(HTML_FILES, ['views']).on('change', eventlog)
  gulp.watch([HTML_TEMPLATE, HTML_VIEWS], ['views']).on('change', eventlog)
  gulp.watch(IMAGE_FILES, ['images']).on('change', eventlog)
  gulp.watch(STYLUS_FILES_ALL, ['css']).on('change', eventlog)
  log('watching now...')
  notify('watching now...')
}

// Gulp Tasks
// Hint no need to install global `gulp` you can run all this tasks with npm scripts
// See `package.json` for more details
gulp.task('dev', ['build'], watch)
gulp.task('default', ['build'], watch)
gulp.task('build', ['clean', 'copy', 'iconfont', 'css', 'images', 'js', 'views'], onsuccess)

gulp.task('copy', copy)
gulp.task('lint', lint)
gulp.task('html', html)
gulp.task('views', views)
gulp.task('images', images)
gulp.task('js', js)
gulp.task('clean', () => del.sync(DEST))

gulp.task('iconfont-hash', font.invalidate)
gulp.task('iconfont-create', ['iconfont-hash'], font.create)
gulp.task('iconfont-css', ['iconfont-create'], font.css)
gulp.task('iconfont-html', ['iconfont-create'], font.html)
gulp.task('iconfont', ['iconfont-css', 'iconfont-html'], font.once)

gulp.task('css', ['iconfont'], () => failsafe ? cssdev() : cssdist())
