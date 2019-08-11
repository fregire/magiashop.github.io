const gulp = require('gulp');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const rigger = require('gulp-rigger');
const scss = require('gulp-sass');
const server = require('browser-sync').create();
const watch = require('gulp-watch');
const urlPrefixer = require('gulp-url-prefixer');


const path = {
	src: {
		htmlTemplates: './src/templates/**/*.html',
		html: './src/*.html',
		css: './src/scss/**/*.scss',
		js: './src/js/**/*.js',
		img: './src/img/**/*.{svg,png,jpeg,jpg}',
		fonts: './src/fonts/**/*.{woff2,woff,ttf}'
	},
	build: {
		html: './build/',
		css: './build/css/',
		js: './build/js/',
		img: './build/img/',
		fonts: './build/fonts/'
	}
}
gulp.task('styles', () => {
	return gulp.src(path.src.css)
			.pipe( scss() )
			.pipe( postcss([
				autoprefixer()
			]) )
			.pipe( gulp.dest(path.build.css) )
			.pipe( server.stream() );
});

gulp.task('fonts', () => {
	return gulp.src(path.src.fonts)
			.pipe(gulp.dest(path.build.fonts));
});

gulp.task('html', () => {
	return gulp.src(path.src.html)
			.pipe( rigger() )
			.pipe( urlPrefixer.html({
				prefix: 'http://localhost:3228/'
			}) )
			.pipe( gulp.dest(path.build.html) )
			.pipe( server.stream() );
});

gulp.task('js', () => {
	return gulp.src(path.src.js)
			.pipe(gulp.dest(path.build.js));
});

gulp.task('img', () => {
	return gulp.src(path.src.img)
			.pipe(gulp.dest(path.build.img));
});

gulp.task('server', gulp.series('html', 'img', 'styles', 'fonts', () => {
	

	server.init({
		server: {
			baseDir: './build'
		},
		port: 3228
	});

	gulp.watch(path.src.css, gulp.series('styles'));
	gulp.watch(path.src.html, gulp.series('html')).on('change', server.reload);
	gulp.watch(path.src.js, gulp.series('js'));
	gulp.watch(path.src.img, gulp.series('img'));
	gulp.watch(path.src.htmlTemplates, gulp.series('html'));

}));
