// Подключаем модули gulp-a
const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();

const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const imagemin = require('gulp-imagemin');

const babel = require('gulp-babel');


// Переменные
const basedir = './ringo/works/';
const path = basedir + 'static/';

// Порядок подключения js файлов
const jsFiles = [
	path + 'js/libs.js',
	path + 'js/app.js',
];


// Таск на стили
function style() {

	return gulp.src(path + 'scss/**/*.scss')
			.pipe(sourcemaps.init())
			.pipe(sass())
			.pipe(autoprefixer({
				browsers: ['>0.1%', 'ie >= 9'], // with old browser versions
				cascade: false,
			})) // добавляет префиксы
			// .pipe(cleanCSS({
			// 	// compatibility: 'ie8',// default
			// 	level: 2, // самое высокое сжатие
			// })) // минификация css
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest(path + 'css')) // выходная папка
			.pipe(browserSync.stream())
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

function watch() {
	browserSync.init({
		server: {
			baseDir: basedir + 'templates/works/',
		}
	});

	// gulp.watch(path + 'images/**', imgCompress);
	gulp.watch(path + 'scss/**/*.sass', style);
	gulp.watch(path + 'scss/**/*.scss', style);
	gulp.watch(path + 'js-dev/**/*.js', scripts);
	gulp.watch(basedir  + 'templates/**/*.html').on('change', browserSync.reload);
}



function clean() {
	return del([basedir + 'build/*']);
}

exports.style = style;
exports.scripts = scripts;
exports.watch = watch;
exports.clean = clean;

gulp.task('default', gulp.series(clean, gulp.parallel(style, scripts, imgCompress), watch));
