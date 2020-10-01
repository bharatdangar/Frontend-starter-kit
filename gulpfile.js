var gulp            = require("gulp");
var sass            = require("gulp-sass");
var autoprefixer    = require("gulp-autoprefixer");
var sourcemaps      = require("gulp-sourcemaps");

var jsImport        = require("advanced-js-import");
var uglify          = require("gulp-uglify");
var concat          = require("gulp-concat");

var notify          = require("gulp-notify");
var rename          = require("gulp-rename");
var replace         = require("gulp-replace");
var runSequence     = require("run-sequence");

var nunjucksRender  = require("gulp-nunjucks-render");
var pleeease        = require("gulp-pleeease");
var htmlclean       = require("gulp-htmlclean");
var preprocess      = require("gulp-preprocess");
var newer           = require("gulp-newer");
var size            = require("gulp-size");
var del             = require("del");
var htmlclean       = require("gulp-htmlclean");
var browsersync     = require("browser-sync");
var babel           = require("gulp-babel");
var babelCore       = require("babel-core");
var babelPreset     = require("babel-preset-env");
var babelPoly       = require("babel-polyfill");
var connect         = require("gulp-connect");

const webpack       = require('webpack');
const notifier      = require('node-notifier');
const Log           = require('./Log.js');
const webpackConfig = require('./webpack.config.js');
const webpackConfigBuild = require('./webpack.config.prod.js');
const requireDir    = require('require-dir');


// Cache needs to be initialized outside of the Gulp task 
var cache;

var googleWebFonts  = require("gulp-google-webfonts");
var gulps           = require("gulp-series");

var gutil 			= require("gulp-util");
var ftp 			= require("vinyl-ftp");

var imagemin        = require("gulp-imagemin");
var webp            = require("gulp-webp"); //Please use older version gulp webp to solver slice issue with this command > npm i -D gulp-webp@3

var styleSRC        = 'src/scss/style.scss';
var styleURL        = 'dist/css';
var scriptSRC       = 'src/js/main.js';
var scriptDest      = 'dist/js';
var ImgSRC          = 'src/img/**/*';
var ImgDestination  = 'dist/img';
var fontSrc         = 'src/fonts/**/*';
var fontDest        = 'dist/fonts';
var mapURL          = './';

var source = 'src/',
    dest = 'dist/',
    nodedir = 'node_modules/',
    nunjucks = {
        watch: [source + 'pages/**/*', source + 'templates/**/*'],
    },
    style = {
        watch: [source + 'scss/**/*'],
    },
    script = {
        watch: [source + 'js/**/*'],
    },
    images = {
        watch: [source + 'img/**/*'],
    },
    fontsCopy = {
        watch: [source + 'fonts/**/*'],
    },
    video = {
        watch: [source + 'videos/**/*'],
    };

syncOpts = {
    server: {
        baseDir: dest,
        index: "index.html"
    },
    open: false,
    notify: true
};


//-------------------------------------                                  
// Please check this URL for to fix { How to fix "ReferenceError: primordials is not defined" error }
// https://timonweb.com/posts/how-to-fix-referenceerror-primordials-is-not-defined-error/
// https://nshki.com/es6-in-gulp-projects/ (Es6 For gulp)
// npm install

//-------------------------------------                                  
// nunjucks template
//
gulp.task('clean', function(){
    del([
        dest + '*'
    ]);
});


gulp.task('nunjucks', function() { 
    // Gets .html and .nunjucks files in pages
    return gulp.src('src/pages/**/*.+(html|nunjucks)')
    // Renders template with nunjucks
    .pipe(nunjucksRender({
        path: ['src/templates']
    }))
    // .pipe(htmlclean())
    // output files in app folder
    .pipe(gulp.dest('dist'))
});

  // browser sync
gulp.task('browsersync', function() {
    browsersync(syncOpts);
});

//-------------------------------------                                  
// Styles for Development
//
gulp.task( 'styles-dev', function() {
    gulp.src([ styleSRC ])
    .pipe( sourcemaps.init() )
    .pipe( sass({
        errLogToConsole: true,
        outputStyle: 'expanded'
    }) )
    .on( 'error', console.error.bind( console ) )
    .pipe(autoprefixer( ['> 0.000001%']) )
    .pipe( sourcemaps.write( mapURL ) )
    .pipe( gulp.dest( styleURL ))
    .pipe(notify({
        message: 'SCSS COMPILED', 
        onLast: true
    }))
});



//-------------------------------------                                  
// Styles for Production          
//
gulp.task( 'styles-prod', function() {
    gulp.src([ styleSRC ])
    .pipe( sass({
        errLogToConsole: true,
        outputStyle: 'compressed'
    }) )
    .on( 'error', console.error.bind( console ) )
    .pipe(autoprefixer( ['> 0.000001%']) )
    //.pipe( rename( { suffix: '.min' } ) )
    .pipe( sourcemaps.write( mapURL ) )
    .pipe( gulp.dest( styleURL ))
    .pipe(notify({
        message: 'SCSS COMPILED PROD',
        onLast: true
    }))
}); 

//-------------------------------------                                  
// Concatenate JS for Development
//
gulp.task('scripts', function() {
    return gulp.src(
            [ 
                scriptSRC
            ]
        )
        .pipe(jsImport({
            hideConsole: true,
            es6import: false
        }))
        .pipe(concat('app.js'))
        .pipe(gulp.dest( scriptDest )) 
});


//gulp.task('scripts', ['modernizr'], (callback) => {
gulp.task('scripts-dev', (callback) => {
    webpack(webpackConfig, (err, stats) => {
        if (err) {
            new Log('Webpack', err).error();
        }
        new Log('Webpack',
            stats.toString({
                assets: true,
                chunks: false,
                chunkModules: false,
                colors: true,
                hash: false,
                timings: true,
                version: false
            })
        ).info();
        callback();
    });
});

gulp.task('scripts-prod', (callback) => {
    webpack(webpackConfigBuild, (err, stats) => {
        if (err) {
            new Log('Webpack', err).error();
        }
        new Log('Webpack',
            stats.toString({
                assets: true,
                chunks: false,
                chunkModules: false,
                colors: true,
                hash: false,
                timings: true,
                version: false
            })
        ).info();
        callback();
    });
});

//-------------------------------------                                  
// Concatenate & Minify JS for Production
//
gulp.task('scripts', function() {
    return gulp.src('dist/js/app.js')
        .pipe(concat('app.js'))
        //.pipe(rename('app.min.js'))
        .pipe(uglify().on('error', console.error))
        .pipe(uglify())
        .pipe(gulp.dest( scriptDest ))
});


//-------------------------------------                                  
// Image min for Development
//
gulp.task( 'image', function() { 
    gulp.src(ImgSRC)
    .pipe(
        imagemin({
            interlaced: true,
            progressive: true,
            optimizationLevel: 7,
            svgoPlugins: [
                {
                    removeViewBox: true
                }
            ]
        })
    )
    .pipe(gulp.dest(ImgDestination))
}); 

gulp.task("webp",function(){
    gulp.src(ImgSRC)
    .pipe(webp({
        quality: 80
    }))
    .pipe(gulp.dest(ImgDestination))
});



//-------------------------------------                                  
// Download Google Fonts
// Go to : assets/dist/fonts/fonts.list to add your fonts
//
var options = {
    cssFilename: '_02_fonts.scss',
    fontsDir: 'dist/fonts/',
    cssDir: 'src/scss/03_core/',
    format: 'woff'
};

gulp.task('google-fonts', function () {
    return gulp.src('src/fonts/fonts.list')
        .pipe(googleWebFonts(options))
        .pipe(gulp.dest('.'));
});

gulp.task('fonts-url' , function() {
    return gulp.src( 'src/scss/03_core/_02_fonts.scss', {base: "./"})
    .pipe(replace('url(dist/fonts/', 'url(../fonts/'))
    .pipe(gulp.dest("./"));

});

gulp.task('fonts', runSequence('google-fonts' , 'fonts-url' ));

gulp.task( 'fontscopy', function() {
    gulp.src(fontSrc)
    .pipe(gulp.dest(fontDest))
}); 


//PLease use FTP for upload automate process to use with "gulp deploy" task, you need to fill detail toc connect FTP
gulp.task( 'deploy', function () {
 
    var conn = ftp.create( {
        host:     '',   // Host Address
        user:     '',     // FTP username
        password: '',       // FTP Password
        parallel: 21,               // Port
        log:      gutil.log,

    } );
 
	var localFilesGlob = ['../dist/js/**'];  // Your local file path where to Fetch all files from you local directory 
	var remoteFolder = '/wp-content/themes/geraldkern/dist'; // Your destination file path where to upload it ion FTP server

    var globs = [
        '../dist/**',
		'!../dist/*.html', // negated pattern for files
		'!../dist/img/**', // negated pattern for files
		'!../dist/video/**', // negated pattern for files
		'!../dist/img', // negated folder creation
		'!../dist/video', // negated folder creation
    ];
 
    // using base = '.' will transfer everything to /public_html correctly
    // turn off buffering in gulp.src for best performance
 
    return gulp.src( globs, { base: '../dist', buffer: false } ) // Your local file path where to Fetch all files from you local directory 
        .pipe( conn.newer( remoteFolder  ) ) // only upload newer files
        .pipe( conn.dest( remoteFolder  ) );
 
});


// default task
gulp.task('watch', ['nunjucks', 'browsersync'], function() {

    // html changes 
    gulp.watch(nunjucks.watch, ['nunjucks', browsersync.reload]);

    // Watch .scss files
    gulp.watch(style.watch, ['styles-dev', browsersync.reload]);

    // Watch .js files
    gulp.watch(script.watch, ['scripts-dev', browsersync.reload]);  
    
    // Watch image files
    gulp.watch(images.watch, ['image', 'webp', browsersync.reload]);

    // Watch Fonts Generated files
    gulp.watch(fontsCopy.watch, ['fontscopy', browsersync.reload]);

});

// default Build task for minified JS and CSS
//gulp.task('build', ['watch', 'styles-prod', 'scripts-prod','deploy', 'image', 'webp']);
gulp.task('build', ['styles-prod', 'scripts-prod','image', 'webp']);
