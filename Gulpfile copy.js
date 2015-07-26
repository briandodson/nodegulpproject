var gulp = require('gulp'), 
				gutil = require('gulp-util'),
				sass = require('gulp-sass'), 
				csso = require('gulp-csso'), 
				uglify = require('gulp-uglify'), 
				concat = require('gulp-concat'), 
				livereload = require('gulp-livereload'), 
				tinylr = require('tiny-lr'), 
				express = require('express'), 
				app = express(), 
				marked = require('marked'), 
				path = require('path'),
				neat = require('node-neat').includePaths,
				browserSync = require('browser-sync'),
				jade = require('gulp-jade'), 
				server = tinylr();

var paths = {
	scss: 'working/scss/*.scss'	, 
	js: 'working/js/*.js', 
	jade: 'working/templates/*.jade', 
	cssdist: 'assets/css', 
	jsdist: 'assets/js', 
	root: './'
};

//SCSS / CSS
gulp.task('styles',function(){
	return gulp.src(paths.scss)
		.pipe(sass({
			includePaths: ['styles'].concat(neat), 
			errLogToConsole: true
		}))
		.pipe( csso() )
		.pipe( gulp.dest(paths.cssdist) )
		.pipe( livereload(server) );
});

//Uglify JS
gulp.task('scripts', function() {
  return gulp.src(paths.js)
    .pipe( uglify() )
    .pipe( concat('all.min.js') )
    .pipe( gulp.dest(paths.jsdist) )
    .pipe( livereload(server) );
});

//Jade HTML
gulp.task('jadetemplates', function(){
	return gulp.src(paths.jade)
		.pipe(jade({
			pretty: true
		}))
		.pipe(gulp.dest('./'))
		.pipe( livereload(server) );
});

gulp.task('express', function() {
  app.use(express.static(path.resolve(paths.root)));
  app.listen(1337);
  gutil.log('Listening on port: 1337');
});

//Browser Sync
gulp.task('browser-sync',function(){
	browserSync.init(["assets/css/*.css", "assets/js/*.js", "*.html"], {
		server: {
			baseDir: paths.root
		}
	});
});

//Gulp Watch, init browser sync and scss->css

gulp.task('watch', function(){
	server.listen(35729, function (err) {
    if (err) {
      return console.log(err);
    }
		gulp.watch([paths.scss, "working/scss/base/*.scss", "working/scss/sections/*.scss", "working/scss/style/*.scss"], ['styles']);
		gulp.watch([paths.js],['scripts']);
		gulp.watch([paths.jade],['jadetemplates']);
	});
});

gulp.task('default', ['jadetemplates', 'styles', 'scripts', 'express', 'watch'], function(){
	gulp.start('styles');
});
