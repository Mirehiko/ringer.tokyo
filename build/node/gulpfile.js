// Подключаем модули gulp-a
const gulp = require('gulp');
const browserSync = require('browser-sync').create();


// Общее для всех типов файлов
const clean = require('gulp-clean'); // удаление файлов и папок
const cleanBuild = require('gulp-dest-clean'); // удаление файлов в папке назначения если их нет в исходниках
const cache = require('gulp-cached'); // кэширование файлов
const rename = require('gulp-rename'); // переименование файла
const sourcemaps = require('gulp-sourcemaps');
const dependents = require('gulp-dependents'); // для отслеживания связных scss-файлов
const filter = require('gulp-filter'); // фильтрация потока файлов по заданному фильтру
const rigger = require('gulp-rigger'); // import files from construction "//= file.exctention"
const changed = require('gulp-changed'); // только измененные файлы
const logger = require('gulp-logger'); // логирование действий
const touch = require('gulp-touch-cmd'); // используется для обновления времени изменения фалйа
const del = require('del'); // удаление файла
const path = require('path'); // получение пути файла
const plumber = require('gulp-plumber');


// HTML
const htmlValidator = require('gulp-w3c-html-validator');


// Для SCSS / CSS
const sass = require('gulp-sass'); // компиляция scss -> css
const autoprefixer = require('gulp-autoprefixer'); // добавление css-префиксов
const cleanCSS = require('gulp-clean-css'); // минификатор css


// Для js
const babel = require('gulp-babel'); //es6 -> es5
const minify = require('gulp-minify'); // минификация js (удаление только лишних пробелов)
// const uglify = require('gulp-uglify'); // minify js files
// const jsImport = require('gulp-js-import'); // remove or not?


// Для картинок
const imagemin = require('gulp-imagemin');



//==========================================================================



// Переменные
const entrypoint   = '/sources';
const build_folder = `${ entrypoint }/static`;
const src_folder   = `${ entrypoint }/static_dev`;
const tmp_folder   = `${ entrypoint }/templates`;

const routes = {
	build: {
		images: 	 `${ build_folder }/images/`,
		styles: 	 `${ build_folder }/css/`,
		scripts:     `${ build_folder }/js/`,
		scripts_tmp: `${ build_folder }/tmp/js/`,
	},
	src: {
		images: 	 `${ src_folder }/images/**`,
		styles: 	 [
			`${ src_folder }scss/**/*.scss`, 
			`${ src_folder }scss/**/*.sass`,
		],
		scripts:     `${ src_folder }/js/**/*.js`,
		scripts_tmp: `${ src_folder }/tmp/js/**/*.js`,
	},
};

const config = {
	server: {
		baseDir: `${ entrypoint }/`,
	},
	// tunnel: true,
	// host: 'localhost',
	// port: 9000,
	// logPrefix: "Frontend",
};

var watchInBrowser = false;

//==========================================================================

// const build_dir = entrypoint + '';
// const src_dir = entrypoint + '';
// const routes = {
// 	build: {
// 		scripts: build_dir + 'js/',
// 		scripts_tmp: src_dir + 'tmp/js/',
// 		styles: build_dir + 'css/',
// 		// images: build_dir + 'images/',
// 	},
// 	src: {
// 		js: src_dir + '**/*.js',
// 		scripts: src_dir + 'js-dev/**/*.js',
// 		scripts_tmp: src_dir + 'tmp/js/**/*.js',
// 		styles: [`${src_dir}scss/**/*.scss`, `${src_dir}scss/**/*.sass`],
// 		// images: src_dir + 'images/**',
// 	},

// 	devImg: src_dir + 'images/**',
// 	// buildImg: build_dir + 'images/',
// };
// const config = {
// 	server: {
// 		baseDir: entrypoint,
// 	},
// 	// tunnel: true,
// 	// host: 'localhost',
// 	// port: 9000,
// 	// logPrefix: "Frontend",
// }
// var watchInBrowser = false;




// HTML
const validator_routes = `${ tmp_folder }/**/*.html`;
function validateHtml() {
	return gulp.src(validator_routes, {allowEmpty: true, read:true})
		.pipe( htmlValidator() )
		.pipe( htmlValidator.reporter() );
}
 




// CSS ==============================================================


function stylesDev() {
	return gulp.src(routes.src.styles, { restore: true })
		.pipe(cache('files_changes')) // Кэшируем для определения только измененных файлов
		.pipe(dependents()) // если есть связанные файлы, то меняем и их
		.pipe(logger({ showChange: true })) // логируем изменяемые файлы
		// добавляем префиксы и sourcemap-ы для .css файлов
		.pipe(sourcemaps.init())
		.pipe(sass()) // переводим в css
		.pipe(autoprefixer({
			remove:  false,
			cascade: false,
		})) // добавляем префиксы
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(routes.build.styles))
		// .. далее минифицируем и добавляем sourcemap-ы для .min.css
		.pipe(filter('**/*.css'))
		.pipe(cleanCSS({
			compatibility: 'ie8', // default
		})) // минификация css
		.pipe(rename(function (src_dir) {
			src_dir.basename += ".min"; //до расширения файла
		}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(routes.build.styles)) // выходная папка
		.pipe(touch())
		.pipe(browserSync.stream())
}

function stylesProd() {
	return gulp.src(routes.src.styles, { restore: true })
		.pipe(cache('files_changes'))
		.pipe(dependents())
		.pipe(logger({ showChange: true }))
		.pipe(sass())
		.pipe(autoprefixer({
			remove:  false,
			cascade: false,
		}))
		.pipe(gulp.dest(routes.build.styles))
		.pipe(cleanCSS({
			compatibility: 'ie8',
		})) // минификация css
		.pipe(rename(function (src_dir) {
			src_dir.basename += ".min";
		}))
		.pipe(gulp.dest(routes.build.styles))
		.pipe(touch())
		.pipe(browserSync.stream())
}

function devWatchCSS() {
	if (watchInBrowser) {
		browserSync.init(config);
	}
	
	for (let item of routes.src.styles) {
		clearDeletedCSS(gulp.watch(item, stylesDev));
	}
}

function prodWatchCSS() {
	if (watchInBrowser) {
		browserSync.init(config);
	}

	for (let item of routes.src.styles) {
		clearDeletedCSS(gulp.watch(item, stylesProd));
	}
}

function clearCSS() {
	return gulp.src(routes.build.styles, {read: false, allowEmpty: true})
		.pipe(logger({
			showChange: true,
			before: 'Clearing destination folder...',
			after:  'Destination folder cleared!',
		}))
    	.pipe(clean({force: true}));
}

function clearDeletedCSS(watcher) {
	watcher.on('unlink', function(filepath) {
	    let filePathFromSrc = path.relative(path.resolve('src'), filepath);
	    let file = filePathFromSrc.split('/scss/')[1]; // файл
	    let [file_name, file_ext] = file.split('.');
	    file_ext = 'css';

	    let delfile       = path.resolve(routes.build.styles, `${ file_name }.${ file_ext }`);
	    let delfilemap    = path.resolve(routes.build.styles, `${ file_name }.${ file_ext }.map`);
	    let delfilemin    = path.resolve(routes.build.styles, `${ file_name }.min.${ file_ext }`);
	    let delfileminmap = path.resolve(routes.build.styles, `${ file_name }.min.${ file_ext }.map`);

	    del.sync(delfile);
	    console.log('[File deleted] ', delfile);
	    del.sync(delfilemap);
	    console.log('[File deleted] ', delfilemap);
	    del.sync(delfilemin);
	    console.log('[File deleted] ', delfilemin);
	    del.sync(delfileminmap);
	    console.log('[File deleted] ', delfileminmap);
	});
}




// JavaScript =======================================================


// Таск на сборку js файла из нескольких
function makeJSFiles(){
	// let filtered = filter(['**/*.js', '!**/_*.js'], {restore: true});

	return gulp.src([routes.src.scripts], { allowEmpty: true })
		.pipe(logger({
			showChange: true,
			before:     'Collecting files...',
			after:      'Collecting complete!',
		}))
		.pipe(rigger())
		// .pipe(filtered) // выбираем только собраные файлы без кусочков
		.pipe(gulp.dest(routes.build.scripts_tmp))
		.pipe(browserSync.stream())
}

// Таск на дальнейшую обработку js-файлов для девелопмента
function buildJSFilesDev() {
	let filtered = filter(['**/*.js', '!**/_*.js'], { restore: true });

	return gulp.src([routes.src.scripts_tmp], { allowEmpty: true, read:true })
		.pipe(cache('files_changes'))
		.pipe(plumber())
		.pipe(logger({
			showChange: true,
			before:     'Building files...',
			after:      'Building complete!',
		}))
		.pipe(filtered)
		.pipe(sourcemaps.init({ loadMaps: true }))
	    .pipe(babel({
	      presets: [
	        ['@babel/env', {
	          modules: false
	        }]
	      ]
	    }))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(routes.build.scripts))
		.pipe(filter('**/*.js'))
		.pipe(rename(function (path) {
			path.basename += ".min";//до расширения файла
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(routes.build.scripts)) // выходная папка
		.pipe(touch())
		.pipe(browserSync.stream());
}

// Таск на дальнейшую обработку js-файлов для продакшена
function buildJSFilesProd() {
	let filtered = filter(['**/*.js', '!**/_*.js'], { restore: true });

	return gulp.src([routes.src.scripts_tmp], { allowEmpty: true, read:true })
		.pipe(cache('files_changes'))
		.pipe(plumber())
		.pipe(logger({
			showChange: true,
			before:     'Building files...',
			after:      'Building complete!',
		}))
		.pipe(cleanBuild(routes.build.scripts, '**'))
		.pipe(filtered)
	    .pipe(babel({
	      presets: [
	        ['@babel/env', {
	          modules: false
	        }]
	      ]
	    }))
		.pipe(gulp.dest(routes.build.scripts))
		.pipe(minify({
	        ext:{
	            src: '.js',
	            min: '.min.js'
	        },
		})) // минификация js
		// .pipe(uglify({
		// 	// toplevel: true, // максимальный уровень минификации
		// })) // минификация js
		// .pipe(rename(function (path) {
		// 	path.basename += ".min";//до расширения файла
		// }))
		.pipe(gulp.dest(routes.build.scripts)) // выходная папка
		.pipe(touch())
		.pipe(browserSync.stream());
}

// Вотчер для дева
function devWatchJS() {
	if (watchInBrowser) {
		browserSync.init(config);
	}
	
	let js_watcher_1 = gulp.watch(routes.src.scripts, makeJSFiles);
	let js_watcher_2 = gulp.watch(routes.src.scripts_tmp, buildJSFilesDev);

	clearDeletedJS(js_watcher_1);
}

// Вотчер для продакшена
function prodWatchJS() {
	if (watchInBrowser) {
		browserSync.init(config);
	}
	
	let js_watcher_1 = gulp.watch(routes.src.scripts, makeJSFiles);
	let js_watcher_2 = gulp.watch(routes.src.scripts_tmp, buildJSFilesProd);

	clearDeletedJS(js_watcher_1);
}

function clearJS() {
	return gulp.src([routes.build.scripts, routes.build.scripts_tmp], { read: false, allowEmpty: true })
		.pipe(logger({
			showChange: true,
			before:     'Clearing destination folder...',
			after:      'Destination folder cleared!',
		}))
    	.pipe(clean({force: true}));
}

function clearDeletedJS(watcher) {
	watcher.on('unlink', function(filepath) {
	    let filePathFromSrc = path.relative(path.resolve('src'), filepath);
	    let file = filePathFromSrc.split('/js/')[1]; // файл
	    let [file_name, file_ext] = file.split('.');

	    let delfile       = path.resolve(routes.build.scripts, file);
	    let tmpfile       = path.resolve(routes.build.scripts_tmp, file);
	    let delfilemap    = path.resolve(routes.build.scripts, `${ file }.map`);
	    let delfilemin    = path.resolve(routes.build.scripts, `${ file_name }.min.${ file_ext }`);
	    let delfileminmap = path.resolve(routes.build.scripts, `${ file_name }.min.${ file_ext }.map`);

	    del.sync(delfile);
	    console.log('[File deleted] ', delfile);
	    del.sync(tmpfile);
	    console.log('[File deleted] ', tmpfile);
	    del.sync(delfilemap);
	    console.log('[File deleted] ', delfilemap);
	    del.sync(delfilemin);
	    console.log('[File deleted] ', delfilemin);
	    del.sync(delfileminmap);
	    console.log('[File deleted] ', delfileminmap);

	});
}




// Images ===========================================================


// Таск на изображения
// function imgCompress() {
// 	return gulp.src(routes.devImg, {restore: true})
// 		.pipe(imagemin({
// 			progressive: true,
// 		}))
// 		.pipe(gulp.dest(routes.buildImg))
// }

// function watchImages() {
// 	if (watchInBrowser) {
// 		browserSync.init(config);
// 	}
	
// 	gulp.watch(routes.devImg, imgCompress);
// }

// function clearImages() {
// 	return gulp.src([routes.buildImg], {read: false})
// 		.pipe(logger({
// 			showChange: true,
// 			before: 'Clearing destination folder...',
// 			after: 'Destination folder cleared!',
// 		}))
//     	.pipe(clean({force: true}));
// }





// All ==============================================================


function watchDev() {
	if (watchInBrowser) {
		browserSync.init(config);
	}
	
	for (let item of routes.src.styles) {
		let watcher = gulp.watch(item, stylesDev).on('change', browserSync.reload);
		clearDeletedCSS(watcher);
	}

	let js_watcher_1 = gulp.watch(routes.src.scripts, makeJSFiles).on('change', browserSync.reload);
	let js_watcher_2 = gulp.watch(routes.src.scripts_tmp, buildJSFilesDev).on('change', browserSync.reload);
	let html_watcher = gulp.watch(entrypoint  + '*.html').on('change', browserSync.reload);
	// let img_watcher  = gulp.watch(routes.devImg, imgCompress);

	clearDeletedJS(js_watcher_1);
}

function watchProd() {
	if (watchInBrowser) {
		browserSync.init(config);
	}

	for (let item of routes.src.styles) {
		let watcher = gulp.watch(item, stylesProd);
		clearDeletedCSS(watcher);
	}

	let js_watcher_1 = gulp.watch(routes.src.scripts, makeJSFiles);
	let js_watcher_2 = gulp.watch(routes.src.scripts_tmp, buildJSFilesProd);
	let html_watcher = gulp.watch(entrypoint  + '*.html').on('change', browserSync.reload);
	// let img_watcher  = gulp.watch(routes.devImg, imgCompress);

	clearDeletedJS(js_watcher_1);
}

// полная очистка дирректории с готовыми файлами
function clearDir() {
	return gulp.src(build_folder, { read: false, allowEmpty: true })
		.pipe(logger({
			showChange: true,
			before:     'Clearing destination folder...',
			after:      'Destination folder cleared!',
		}))
    	.pipe(clean({ force: true }));
}

function clearTmp() {
	return gulp.src(`${ src_folder }/tmp`, { read: false, allowEmpty: true })
		.pipe(logger({
			showChange: true,
			before:     'Clearing tmp folder...',
			after:      'Tmp folder cleared!',
		}))
    	.pipe(clean({ orce: true }));
}

// очистка дирректории с css-файлами от sourcemap-ов
function clearSourceMaps() {
	return gulp.src([build_folder + 'css/**/*.map', build_folder + 'js/**/*.map'], { read: false, allowEmpty: true })
		.pipe(logger({
			showChange: true,
			before:     'Clearing sourcemaps...',
			after:      'Sourcemaps cleared!',
		}))
    	.pipe(clean({ force: true }));
}

function saveCache() {
	const css  = routes.build.styles + 'css/**/*.css';
	const maps = src_folder + 'css/**/*.map'
	const js   = routes.build.scripts + '**/*.js';
	const files_for_cache = [css, routes.src.scripts, js].concat(routes.src.styles);

	return gulp.src(files_for_cache)
		.pipe(cache('files_changes'));
}

function clearCache() {
  return new Promise(function(resolve, reject) {
    delete cache.caches['files_changes'];
    console.log('Cache cleared');
    resolve();
  });
}





// ==================================================================


// HTML
exports.validateHtml = validateHtml;


// JS
exports.makeJSFiles = makeJSFiles;
exports.buildJSFilesDev = buildJSFilesDev;
exports.buildJSFilesProd = buildJSFilesProd;
exports.devWatchJS = devWatchJS;
exports.prodWatchJS = prodWatchJS;
exports.clearJS = clearJS;


// CSS
exports.stylesDev = stylesDev;
exports.stylesProd = stylesProd;
exports.devWatchCSS = devWatchCSS;
exports.prodWatchCSS = prodWatchCSS;
exports.clearCSS = clearCSS;


// Images
/*exports.imgCompress = imgCompress;
exports.watchImages = watchImages;
exports.clearImages = clearImages;*/


// All
exports.watchDev = watchDev;
exports.watchProd = watchProd;
exports.clearDir = clearDir; 
exports.clearTmp = clearTmp; 
exports.clearSourceMaps = clearSourceMaps;
exports.saveCache = saveCache;
exports.clearCache = clearCache;



// ==================================================================



gulp.task('validateHtml', validateHtml);


gulp.task('js-dev', gulp.series(clearTmp, makeJSFiles, buildJSFilesDev, saveCache));
gulp.task('js-prod', gulp.series(clearTmp, makeJSFiles, buildJSFilesProd, saveCache));
gulp.task('watch-js-dev', gulp.series(clearTmp, makeJSFiles, buildJSFilesDev, saveCache, devWatchJS));
gulp.task('watch-js-prod', gulp.series(clearTmp, makeJSFiles, buildJSFilesProd, saveCache, prodWatchJS));
gulp.task('build-js', gulp.series(clearSourceMaps, makeJSFiles, buildJSFilesProd, clearCache, clearTmp));


gulp.task('css-dev', gulp.series(stylesDev, saveCache));
gulp.task('css-prod', gulp.series(stylesProd, saveCache));
gulp.task('watch-css-dev', gulp.series(stylesDev, saveCache, devWatchCSS));
gulp.task('watch-css-prod', gulp.series(stylesProd, saveCache, prodWatchCSS));
gulp.task('build-css', gulp.series(clearSourceMaps, stylesProd, clearCache, clearTmp));

// gulp.task('images', gulp.series(clearImages, imgCompress));
// gulp.task('watch-images', gulp.series(clearImages, imgCompress, watchImages));


gulp.task('clear-cache', clearCache);
gulp.task('clear-build', clearDir);
gulp.task('clear-tmp', clearTmp);

gulp.task('dev', gulp.series(clearTmp, stylesDev, makeJSFiles, buildJSFilesDev, saveCache));
gulp.task('prod', gulp.series(clearTmp, stylesProd, makeJSFiles, buildJSFilesProd, saveCache));
gulp.task('watch-dev', gulp.series(clearTmp, stylesDev, makeJSFiles, buildJSFilesDev, saveCache, watchDev));
gulp.task('watch-prod', gulp.series(clearTmp, stylesProd, makeJSFiles, buildJSFilesProd, saveCache, watchProd));
gulp.task('build', gulp.series(clearSourceMaps, stylesProd, makeJSFiles, buildJSFilesProd, clearCache, clearTmp));
