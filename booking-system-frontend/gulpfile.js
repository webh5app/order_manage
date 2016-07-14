var path         = require('path'),
    gulp         = require('gulp'),
    babel        = require('gulp-babel'),
    uglify       = require('gulp-uglify'),
    sourcemaps   = require('gulp-sourcemaps'),
    rename       = require('gulp-rename'),
    cleanCSS     = require('gulp-clean-css'),
    sass         = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    livereload   = require('gulp-livereload'),
    imagemin     = require('gulp-imagemin'),
    webserver    = require('gulp-webserver'),
    nodemon      = require('gulp-nodemon');

var DEV_DIR   = path.resolve(__dirname, './public/src'),
    BUILD_DIR = path.resolve(__dirname, './public/build');
var MODE = process.env.npm_lifecycle_event;

gulp.task('html', function() {
  gulp.src(path.join(DEV_DIR, '/*.html'))
      .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('uglify', function() {
    if(MODE === 'build') {
        gulp.src(path.join(DEV_DIR, 'js/**/*.js'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(rename(function(path) {
            path.basename += '.min';
        }))
        .pipe(gulp.dest(path.join(BUILD_DIR, '/js')));
    } else {
        gulp.src(path.join(DEV_DIR, 'js/**/*.js'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest(path.join(BUILD_DIR, '/js')))
        .pipe(livereload());
    }
});

gulp.task('sass', function() {
    return sass(path.join(DEV_DIR, '/sass/**/*.scss'), {style: 'expanded'})
           .on('error', sass.logError)
           .pipe(gulp.dest(path.join(DEV_DIR, '/css')));
});

gulp.task('minify-css', function() {
    if (MODE === 'build') {
        gulp.src(path.join(DEV_DIR, 'css/**/*.css'))
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(rename(function(path) {
            path.basename += '.min';
        }))
        .pipe(gulp.dest(path.join(BUILD_DIR, '/css')));
    } else {
        gulp.src(path.join(DEV_DIR, 'css/**/*.css'))
        .pipe(autoprefixer())
        .pipe(gulp.dest(path.join(BUILD_DIR, '/css')))
        .pipe(livereload());
    }
});

var fileChange = function(file) {
    var config = {
        loaders: [
            {suffix: /\.scss$/, loader: 'sass'},
            {suffix: /\.css$/, loader: 'css'},
            {suffix: /\.js$/, loader: 'js'},
            {suffix: /\.(png|jpg)$/, loader: 'image'},
            {suffix: /\.html$/, loader: 'html'},
        ],

        methods: {
            sass: function (filePath) {
                return sass(filePath, {style: 'expanded'})
                    .on('error', sass.logError)
                    .pipe(gulp.dest(path.join(DEV_DIR, '/css')));
            },
            css: function (filePath) {
                gulp.src(filePath)
                .pipe(sourcemaps.init())
                    .pipe(autoprefixer())
                .pipe(sourcemaps.write())
                .pipe(gulp.dest(path.join(BUILD_DIR, '/css')))
                .pipe(livereload());
            },
            js: function (filePath) {
                gulp.src(filePath)
                .pipe(sourcemaps.init())
                    .pipe(babel({
                        presets: ['es2015']
                    }))
                .pipe(sourcemaps.write())
                .pipe(gulp.dest(path.join(BUILD_DIR, '/js')))
                .pipe(livereload());
            },
            image: function (filePath) {
                gulp.src(filePath)
                .pipe(imagemin({optimizationLevel: 5, progressive: true, interlaced: true}))
                .pipe(gulp.dest(path.join(BUILD_DIR, '/images')))
                .pipe(livereload());
            },
            html: function (filePath) {
                gulp.src(filePath)
                .pipe(gulp.dest(BUILD_DIR))
                .pipe(livereload());
            },
        },
    };

    for (var index in config.loaders) {
        if (config.loaders[index].suffix.test(file.path)) {
            config.methods[config.loaders[index].loader](file.path);
        }
    }
};

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(path.join(DEV_DIR, '/**/*')).on('change', function (file) {
        fileChange(file);
    });
});

// gulp.task('webserver', function() {
//     var stream = gulp.src(BUILD_DIR)
//     .pipe(webserver({
//         host: 'localhost',
//         port: 8000,
//         path: '/',
//         livereload: true,
//         open: '/' + ENTRY_PAGE,
//     }));
//     stream.emit('kill');
// });

gulp.task('nodemon', function() {
    nodemon({
        script: 'app.js',
        ext: 'js css html',
        env: {'NODE_ENV': 'development'}
    });
});

if(MODE === 'build') {
    gulp.task('default', [
        'html',
        'uglify',
        'sass',
        'minify-css',
        'imagemin',
    ]);
} else {
    gulp.task('default', [
        'html',
        'uglify',
        'sass',
        'minify-css',
        'watch',
        'nodemon'
    ]);
}
