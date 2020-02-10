// Подключаем модули gulp-a
const gulp = require('gulp');

// Общее для всех типов файлов
const clean = require('gulp-clean'), // удаление файлов и папок
  cleanBuild = require('gulp-dest-clean'), // удаление файлов в папке назначения если их нет в исходниках
  cache = require('gulp-cached'), // кэширование файлов
  rename = require('gulp-rename'), // переименование файла
  sourcemaps = require('gulp-sourcemaps'),
  dependents = require('gulp-dependents'), // для отслеживания связных scss-файлов
  filter = require('gulp-filter'), // фильтрация потока файлов по заданному фильтру
  include = require('gulp-include'), // import
  changed = require('gulp-changed'), // только измененные файлы
  logger = require('gulp-logger'), // логирование действий
  touch = require('gulp-touch-cmd'), // используется для обновления времени изменения фалйа
  del = require('del'), // удаление файла
  path = require('path'), // получение пути файла
  plumber = require('gulp-plumber'),
  flatten = require('gulp-flatten'), // для управления структурой папок
  size = require('gulp-size'),
  mode = require('gulp-mode')({
    modes: ['production', 'development'],
    default: 'production',
    verbose: false
  }); // установки ключа --production/--development для сборки

// Для SCSS / CSS
const sass = require('gulp-sass'); // scss -> css
const autoprefixer = require('gulp-autoprefixer'); // добавление css-префиксов
const cleanCSS = require('gulp-clean-css'); // минификация css-файлов

// Для js
const babel = require('gulp-babel'); // es6 -> es5
const minify = require('gulp-minify'); // минификация js (удаление только лишних пробелов)

// Images
const imagemin = require('gulp-imagemin');

//------------------------------------------------------------------------------

// Переменные
const entry = '/frontend/'; // точка входа
const source_dir = `${entry}app/`; // папка с исходниками
const src_static = `${source_dir}static-dev/`; // исходники скриптов и стилей
const dest_static = `${entry}static/`; // папка выхлопа скриптов и стилей
const tmp_dir = `${source_dir}temps`; // временная папка

const routes = {
  build: {
    scripts: `${dest_static}js/`,
    scripts_tmp: `${tmp_dir}/js/`,
    styles: `${dest_static}css/`,
    images: `${dest_static}images/`
  },
  src: {
    styles: [`${src_static}**/*.scss`, `${src_static}**/*.sass`],
    scripts: [`${src_static}**/*.js`, `${tmp_dir}/**/*.js`],
    // scripts:     `${ src_static }js/**/*.js`,
    scripts_tmp: `${tmp_dir}/js/**/*.js`,
    images: `${src_static}images/**/*`
  },
  cssFilter: [
    `${src_static}**/*.scss`,
    `${src_static}**/*.sass`,
    `!${src_static}components/**`
  ],
  libs: `${src_static}libs`,
  components: {
    src: `${src_static}components/**/*`,
    build: `${src_static}components/`
  },
  fonts: src_static
};

const isProduction = mode.production();

//------------------------------------------------------------------------------

// CSS ==============================================================

function buildStyles() {
  if (isProduction) {
    let filtered = filter(routes.cssFilter);
    return gulp
      .src(routes.src.styles, {
        allowEmpty: true
      })
      .pipe(cache('files_changes'))
      .pipe(dependents())
      .pipe(
        logger({
          showChange: true,
          before: '[production] Starting prod build css-files...',
          after: '[production] Building prod css-files complete.'
        })
      ) // логируем изменяемые файлы
      .pipe(filtered)
      .pipe(sass())
      .pipe(
        autoprefixer({
          remove: false,
          cascade: false
        })
      )
      .pipe(flatten())
      .pipe(gulp.dest(routes.build.styles))
      .pipe(
        cleanCSS({
          compatibility: 'ie8'
        })
      ) // минификация css
      .pipe(
        rename(function(src_dir) {
          src_dir.basename += '.min';
        })
      )
      .pipe(gulp.dest(routes.build.styles))
      .pipe(touch())
      .pipe(size());
  } else {
    let filtered = filter(routes.cssFilter);
    return (
      gulp
        .src(routes.src.styles, {
          allowEmpty: true
        })
        // .pipe(stripDebug())
        .pipe(cache('files_changes')) // Кэшируем для определения только измененных файлов
        .pipe(dependents()) // если есть связанные файлы, то меняем и их
        .pipe(
          logger({
            showChange: true,
            before: '[development] Starting dev build css-files...',
            after: '[development] Building dev css-files complete.'
          })
        ) // логируем изменяемые файлы
        .pipe(filtered)
        .pipe(sourcemaps.init())
        .pipe(sass()) // переводим в css
        .pipe(
          autoprefixer({
            remove: false,
            cascade: false
          })
        ) // добавляем префиксы
        .pipe(flatten()) // пишем файлы без сохранения структуры папок
        .pipe(sourcemaps.write('./')) // sourcemap-ы для .css файлов
        .pipe(gulp.dest(routes.build.styles))
        // // .. далее минифицируем и добавляем sourcemap-ы для .min.css
        .pipe(filter('**/*.css'))
        .pipe(
          cleanCSS({
            compatibility: 'ie8' // default
          })
        ) // минификация css
        .pipe(
          rename(function(src_dir) {
            src_dir.basename += '.min'; //до расширения файла
          })
        )
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(routes.build.styles)) // выходная папка
        .pipe(touch())
    );
  }
}

function watchCSS() {
  let watcher = gulp.watch(routes.src.styles, buildStyles);
  clearDeletedCSS(watcher);
}

function clearCSS() {
  return gulp
    .src(routes.build.styles, {
      read: false,
      allowEmpty: true
    })
    .pipe(
      logger({
        showChange: true,
        before: 'Clearing destination folder...',
        after: 'Destination folder cleared!'
      })
    )
    .pipe(
      clean({
        force: true
      })
    );
}

function clearDeletedCSS(watcher) {
  watcher.on('unlink', function(filepath) {
    let filePathFromSrc = path.relative(path.resolve('src'), filepath);
    let file = filePathFromSrc.split('/scss/')[1]; // файл
    let [file_name, file_ext] = file.split('.');
    file_ext = 'css';

    let delfile = path.resolve(routes.build.styles, `${file_name}.${file_ext}`);
    let delfilemap = path.resolve(
      routes.build.styles,
      `${file_name}.${file_ext}.map`
    );
    let delfilemin = path.resolve(
      routes.build.styles,
      `${file_name}.min.${file_ext}`
    );
    let delfileminmap = path.resolve(
      routes.build.styles,
      `${file_name}.min.${file_ext}.map`
    );

    del.sync(delfile, {
      force: true
    });
    console.log('[File deleted] ', delfile);

    del.sync(delfilemap, {
      force: true
    });
    console.log('[File deleted] ', delfilemap);

    del.sync(delfilemin, {
      force: true
    });
    console.log('[File deleted] ', delfilemin);

    del.sync(delfileminmap, {
      force: true
    });
    console.log('[File deleted] ', delfileminmap);
  });
}

//------------------------------------------------------------------------------

// JavaScript =======================================================

// Таск на конкатенацию js файлов
function makeJSFiles() {
  let filtered = filter([`${src_static}js/**/*.js`]);
  return gulp
    .src([`${src_static}**/*.js`], {
      allowEmpty: true
    })
    .pipe(filtered)
    .pipe(
      logger({
        showChange: true,
        before: `${
          mode.production() ? '[production] ' : '[development] '
        }Starting collect js-files...`,
        after: `${
          mode.production() ? '[production] ' : '[development] '
        }Collecting js-files complete.`
      })
    )
    .pipe(include())
    .pipe(flatten())
    .pipe(gulp.dest(routes.build.scripts_tmp));
}

// Таск на дальнейшую обработку js-файлов
function buildScripts() {
  let filtered = filter([`${tmp_dir}/**/*.js`, `!${tmp_dir}/**/_*.js`]);
  if (isProduction) {
    return (
      gulp
        .src(`${tmp_dir}/**/*.js`, {
          allowEmpty: true,
          read: true
        })
        .pipe(filtered)
        .pipe(cache('files_changes'))
        .pipe(plumber())
        .pipe(
          logger({
            showChange: true,
            before: '[production] Starting build js-files...',
            after: '[production] Building js-files complete'
          })
        )
        .pipe(cleanBuild(routes.build.scripts, '**'))
        .pipe(
          babel({
            presets: [
              [
                '@babel/env',
                {
                  modules: false
                }
              ]
            ]
          })
        )
        .pipe(flatten())
        .pipe(gulp.dest(routes.build.scripts))
        .pipe(
          minify({
            ext: {
              src: '.js',
              min: '.min.js'
            }
          })
        ) // минификация js
        // .pipe(uglify({
        // 	// toplevel: true, // максимальный уровень минификации
        // })) // минификация js
        // .pipe(rename(function (path) {
        // 	path.basename += ".min";//до расширения файла
        // }))
        .pipe(gulp.dest(routes.build.scripts)) // выходная папка
        .pipe(touch())
        .pipe(size())
    );
  } else {
    return gulp
      .src([routes.src.scripts_tmp], {
        allowEmpty: true,
        read: true
      })
      .pipe(cache('files_changes'))
      .pipe(plumber())
      .pipe(
        logger({
          showChange: true,
          before: '[development] Starting build js-files...',
          after: '[development] Building js-files complete'
        })
      )
      .pipe(filtered)
      .pipe(
        sourcemaps.init({
          loadMaps: true
        })
      )
      .pipe(
        babel({
          presets: [
            [
              '@babel/env',
              {
                modules: false
              }
            ]
          ]
        })
      )
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(routes.build.scripts))
      .pipe(filter('**/*.js'))
      .pipe(
        rename(function(path) {
          path.basename += '.min'; //до расширения файла
        })
      )
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(routes.build.scripts)) // выходная папка
      .pipe(touch())
      .pipe(size());
  }
}

// Отслеживание измененных js-файлов
function watchJS() {
  let watcher = gulp.watch(
    routes.src.scripts,
    gulp.series(makeJSFiles, buildScripts)
  );
  clearDeletedJS(watcher);
}

function clearJS() {
  return gulp
    .src([routes.build.scripts, routes.build.scripts_tmp], {
      read: false,
      allowEmpty: true
    })
    .pipe(
      logger({
        showChange: true,
        before: '[Action: delete] Clearing destination folder...',
        after: '[Action: delete] Destination folder cleared!'
      })
    )
    .pipe(
      clean({
        force: true
      })
    );
}

function clearDeletedJS(watcher) {
  watcher.on('unlink', function(filepath) {
    let filePathFromSrc = path.relative(path.resolve('src'), filepath);

    let file = filePathFromSrc.split('/js/')[1]; // файл
    let [file_name, file_ext] = file.split('.');

    let delfile = path.resolve(routes.build.scripts, file);
    let tmpfile = path.resolve(routes.build.scripts_tmp, file);
    let delfilemap = path.resolve(routes.build.scripts, `${file}.map`);
    let delfilemin = path.resolve(
      routes.build.scripts,
      `${file_name}.min.${file_ext}`
    );
    let delfileminmap = path.resolve(
      routes.build.scripts,
      `${file_name}.min.${file_ext}.map`
    );

    del.sync(delfile, {
      force: true
    });
    console.log('[File deleted] ', delfile);

    del.sync(tmpfile, {
      force: true
    });
    console.log('[File deleted] ', tmpfile);

    del.sync(delfilemap, {
      force: true
    });
    console.log('[File deleted] ', delfilemap);

    del.sync(delfilemin, {
      force: true
    });
    console.log('[File deleted] ', delfilemin);

    del.sync(delfileminmap, {
      force: true
    });
    console.log('[File deleted] ', delfileminmap);
  });
}

//------------------------------------------------------------------------------

// Images

function optimizeImages() {
  return gulp
    .src(routes.src.images, {
      allowEmpty: true
    })
    .pipe(cache('files_changes'))
    .pipe(changed(routes.build.images))
    .pipe(
      logger({
        showChange: true,
        before: `[${
          mode.production() ? '[production] ' : '[development] '
        }]Starting optimize images...`,
        after: `${
          mode.production() ? '[production] ' : '[development] '
        }Images optimized.`
      })
    )
    .pipe(imagemin())
    .pipe(flatten())
    .pipe(gulp.dest(routes.build.images)) // выходная папка
    .pipe(touch())
    .pipe(size());
}

function watchImages() {
  let img_watcher = gulp.watch(routes.src.images, optimizeImages);
}

function clearImages() {
  return gulp
    .src(routes.build.images, {
      read: false,
      allowEmpty: true
    })
    .pipe(
      logger({
        showChange: true,
        before: '[Action: delete] Starting delete images from build folder...',
        after: '[Action: delete] Images deleted.'
      })
    )
    .pipe(
      clean({
        force: true
      })
    );
}

//------------------------------------------------------------------------------

// All ==============================================================

// Отслеживание измененных файлов
function watchChanges() {
  let css_watcher = gulp.watch(routes.src.styles, buildStyles);
  let img_watcher = gulp.watch(routes.src.images, optimizeImages);
  let js_watcher_1 = gulp.watch(routes.src.scripts, makeJSFiles);
  let js_watcher_2 = gulp.watch(routes.src.scripts_tmp, buildScripts);

  clearDeletedCSS(css_watcher);
  clearDeletedJS(js_watcher_1);
}

// Удаление временной папки со скриптами
function clearTmp() {
  return gulp
    .src(`${tmp_dir}`, {
      read: false,
      allowEmpty: true
    })
    .pipe(
      logger({
        showChange: true,
        before: 'Starting delete "tmp" folder...',
        after: '"Tmp" folder deleted.'
      })
    )
    .pipe(
      clean({
        force: true
      })
    );
}

// очистка дирректории с css-файлами от sourcemap-ов
function clearSourceMaps() {
  return gulp
    .src([`${dest_static}**/*.map`], {
      read: false,
      allowEmpty: true
    })
    .pipe(
      logger({
        showChange: true,
        before: 'Starting delete sourcemaps...',
        after: 'Sourcemaps deleted.'
      })
    )
    .pipe(
      clean({
        force: true
      })
    );
}

function saveCache() {
  const css = `${routes.build.styles}**/*.css`;
  // const maps = `${ routes.build.styles }**/*.map`;
  const js = `${routes.build.scripts}**/*.js`;
  const files_for_cache = [css, js]
    .concat(routes.src.styles)
    .concat(routes.src.scripts);

  return gulp.src(files_for_cache).pipe(cache('files_changes'));
}

function clearCache() {
  return new Promise(function(resolve, reject) {
    delete cache.caches.files_changes;
    console.log('Cache cleared');
    resolve();
  });
}

//------------------------------------------------------------------------------

// JS
//	- main
exports.makeJSFiles = makeJSFiles;
exports.buildScripts = buildScripts;
exports.watchJS = watchJS;
exports.clearJS = clearJS;

// CSS
//	- main
exports.buildStyles = buildStyles;
exports.watchCSS = watchCSS;
exports.clearCSS = clearCSS;

// Images
exports.optimizeImages = optimizeImages;
exports.watchImages = watchImages;
exports.clearImages = clearImages;

// All
exports.watchChanges = watchChanges;
exports.clearSourceMaps = clearSourceMaps;
exports.saveCache = saveCache;
exports.clearCache = clearCache;
exports.clearTmp = clearTmp;

//------------------------------------------------------------------------------

// Main tasks
// CSS
gulp.task('css', gulp.series(buildStyles, saveCache));
gulp.task('watch-css', gulp.series(buildStyles, saveCache, watchCSS));
gulp.task(
  'build-css',
  gulp.series(buildStyles, gulp.parallel(clearSourceMaps, clearCache, clearTmp))
);
gulp.task('clear-css', clearCSS);

// JS
gulp.task('js', gulp.series(clearTmp, makeJSFiles, buildScripts, saveCache));
gulp.task('watch-js', gulp.series(clearTmp, ['js'], watchJS));
gulp.task(
  'build-js',
  gulp.series(
    makeJSFiles,
    buildScripts,
    gulp.parallel(clearSourceMaps, clearCache, clearTmp)
  )
);
gulp.task('clear-js', clearJS);

// Images
gulp.task('images', optimizeImages);
gulp.task('watch-images', optimizeImages, watchImages);
gulp.task('clear-images', clearImages);

// Clear
gulp.task('clear-cache', clearCache);
gulp.task('clear-tmp', clearTmp);

gulp.task(
  'default',
  gulp.series(
    clearTmp,
    gulp.parallel(buildStyles, ['js']),
    saveCache
    // clearTmp, gulp.parallel(buildStyles, optimizeImages, ['js']), saveCache
  )
);
gulp.task(
  'watch',
  gulp.series(
    clearTmp,
    gulp.parallel(buildStyles, ['js']),
    // clearTmp, gulp.parallel(buildStyles, optimizeImages, ['js']),
    saveCache,
    watchChanges
  )
);
gulp.task(
  'build',
  gulp.series(
    clearTmp,
    gulp.parallel(buildStyles, ['js']),
    // clearTmp, gulp.parallel(buildStyles, optimizeImages, ['js']),
    gulp.parallel(clearSourceMaps, clearCache, clearTmp)
  )
);
