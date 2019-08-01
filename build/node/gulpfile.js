// Подключаем модули gulp-a
const gulp = require('gulp');
const clean = require('gulp-clean');
const browserSync = require('browser-sync').create();

// Общее для всех типов файлов
const debug = require('gulp-debug');
const cache = require('gulp-cached');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const dependents = require('gulp-dependents');
const filter = require('gulp-filter');

// Для SCSS / CSS
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

// Для js
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

// Для картинок
const imagemin = require('gulp-imagemin');


// Переменные
const basedir = '/static/';
const path = basedir;

// Порядок подключения js файлов
const jsFiles = [
	path + 'js/libs.js',
	path + 'js/app.js',
];


// Таск на стили
function prodStyles() {
	var csspath = 'css';
	var destination = basedir + csspath;
	return gulp.src(path + 'scss/**/*.scss')
			.pipe(cache('linting'))
			.pipe(dependents())
			.pipe(debug())
			.pipe(sass())
			.pipe(autoprefixer({
				remove: false,
				cascade: false,
			}))
			.pipe(gulp.dest(destination))
			.pipe(cleanCSS({
				compatibility: 'ie8',
			})) // минификация css
			.pipe(rename(function (path) {
				path.basename += ".min";
			}))
			.pipe(gulp.dest(destination))
}

// Таск на стили
function devStyles() {
	var csspath = 'css';
	var destination = basedir + csspath;
	return gulp.src(path + 'scss/**/*.scss')
			.pipe(cache('linting')) // Кэшируем для определения только измененных файлов
			// логируем изменяемые файлы
			.pipe(dependents()) // если есть связанные файлы, то меняем и их
			.pipe(debug())
			// добавляем префиксы и sourcemap-ы для .css файлов
			.pipe(sourcemaps.init())
			.pipe(sass()) // переводим в css
			.pipe(autoprefixer({
				remove: false,
				cascade: false,
			})) // добавляем префиксы
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest(destination))
			// .. далее минифицируем и добавляем sourcemap-ы для .min.css
			.pipe(filter('**/*.css'))
			.pipe(cleanCSS({
				compatibility: 'ie8', // default
			})) // минификация css
			.pipe(rename(function (path) {
				path.basename += ".min"; //до расширения файла
			}))
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest(destination)) // выходная папка
}

function devWatch() {
	gulp.watch(path + 'scss/**/*.sass', devStyles);
	gulp.watch(path + 'scss/**/*.scss', devStyles);
}

function prodWatch() {
	gulp.watch(path + 'scss/**/*.sass', prodStyles);
	gulp.watch(path + 'scss/**/*.scss', prodStyles);
}

// Таск на скрипты
function scripts() {
	// return gulp.src(jsFiles)
	return gulp.src(path + 'js-dev/**/*.js')
			.pipe(babel({
				presets: ['@babel/preset-env']
			})) // ES6 to ES5
			// .pipe(concat('main.js')) // объединение нескольких файлов в один
			.pipe(uglify({
				// toplevel: true, // максимальный уровень минификации
			})) // минификация js
			.pipe(gulp.dest(path + 'js')) // выходная папка
			.pipe(browserSync.stream());
}

// Таск на изображения
function imgCompress() {
	return gulp.src(path + 'images/**')
					.pipe(imagemin({
						progressive: true,
					}))
					.pipe(gulp.dest(basedir + 'build/images/'))
}


function devWatch() {
	gulp.watch(path + 'scss/**/*.sass', devStyles);
	gulp.watch(path + 'scss/**/*.scss', devStyles);
}

function prodWatch() {
	gulp.watch(path + 'scss/**/*.sass', prodStyles);
	gulp.watch(path + 'scss/**/*.scss', prodStyles);
}

function watch() {
	// browserSync.init({
	// 	server: {
	// 		baseDir: basedir + 'templates/works/',
	// 	}
	// });

	// gulp.watch(path + 'images/**', imgCompress);
	// gulp.watch(path + 'scss/**/*.sass', style);
	// gulp.watch(path + 'scss/**/*.scss', style);
	gulp.watch(path + 'js-dev/**/*.js', scripts);
	// gulp.watch(basedir  + 'templates/**/*.html').on('change', browserSync.reload);
}



// function clean() {
// 	return del([basedir + 'build/*']);
// }

function cleanDir() {
	return gulp.src(basedir + 'css/*', {read: false})
        	.pipe(clean({force: true}));
}
function clearSourceMaps() {
	return gulp.src(basedir + 'css/**/*.map', {read: false})
        	.pipe(clean({force: true}));
}

function saveCache() {
	var csspath = 'css/**/*.css';
	var destination = basedir + csspath;
	return gulp.src([path + 'scss/**/*.scss', destination, path + 'css/**/*.map'])
			.pipe(cache('linting'))
			.pipe(dependents())
}
function clearCache() {
  return new Promise(function(resolve, reject) {
    delete cache.caches['linting'];
    console.log('Cache cleared');
    resolve();
  });
}


// exports.style = style;
exports.scripts = scripts;
exports.watch = watch;
// exports.clean = clean;

exports.prodStyles = prodStyles;
exports.devStyles = devStyles;
exports.devWatch = devWatch;
exports.prodWatch = prodWatch;
exports.cleanDir = cleanDir; // полная очистка дирректории с готовыми файлами
exports.clearSourceMaps = clearSourceMaps; //очистка дирректории с готовыми файлами от sourcemap-ов
exports.saveCache = saveCache;
exports.clearCache = clearCache;


// gulp.task('default', gulp.series(clean, gulp.parallel(style, scripts, imgCompress), watch));
gulp.task('default', gulp.series(gulp.parallel(scripts, imgCompress), watch));

gulp.task('clear_cache', clearCache);
gulp.task('dev', gulp.series(devStyles, saveCache, gulp.parallel(devStyles), devWatch));
gulp.task('build', gulp.series(clearSourceMaps, gulp.parallel(prodStyles), clearCache));