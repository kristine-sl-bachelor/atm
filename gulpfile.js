var gulp = require( 'gulp' );
var sass = require( 'gulp-sass' );
var plumber = require( 'gulp-plumber' );
var debug = require( 'gulp-debug' );
var browserSync = require('browser-sync').create();

gulp.task( 'sass', function() {
	return gulp.src( 'assets/sass/main.scss' )
        .pipe( plumber() )
		.pipe( sass() )
		.pipe( gulp.dest( '' ) );
} );

gulp.task('watch', function() {
	gulp.watch( 'assets/sass/**/*.scss', ['sass'] ).on('change', browserSync.reload);
} );

gulp.task('server', function() {
    browserSync.init( {
        server: {
            baseDir: "./"
        }
    } );
});

gulp.task('default', ['server', 'watch', 'sass'] );
