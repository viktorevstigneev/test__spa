import gulp from "gulp";
import plumber from "gulp-plumber";
import rename from "gulp-rename";

import imagemin from "gulp-imagemin";
import pngquant from "imagemin-pngquant";

import webp from "gulp-webp";
import svgstore from "gulp-svgstore";

// import sass from "gulp-sass";

import dartSass from "sass";
import gulpSass from "gulp-sass";

const sass = gulpSass(dartSass);

import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import csso from "gulp-csso";

import posthtml from "gulp-posthtml";
import include from "posthtml-include";

// import server from "browser-sync".create();
import {create as bsCreate} from 'browser-sync';
const server = bsCreate();

import minify from "gulp-minify";
import concat from "gulp-concat";

// import del from "del";
import { deleteAsync } from "del";

gulp.task("css", () => {
  return gulp
    .src("www/scss/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest("docs/css"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("docs/css"));
});

gulp.task("images", () => {
  return (
    gulp
      .src("www/img/*.{png,jpg}")
      // .pipe(
      //   imagemin([
      //     imagemin.optipng({ optimizationLevel: 3 }),
      //     imagemin.mozjpeg({ progressive: true }),
      //   ])
      // )
      .pipe(
        imagemin({
          progressive: true,
          svgoPlugins: [{ removeViewBox: false }],
          use: [pngquant()],
        })
      )
      .pipe(gulp.dest("docs/img"))
  );
});

// gulp.task("webp", () => {
//   return gulp
//     .src("www/img/*.{png,jpg}")
//     .pipe(webp({ quality: 90 }))
//     .pipe(gulp.dest("docs/img"));
// });

// gulp.task("sprite", () => {
//   return gulp
//     .src("www/img/*.svg")
//     .pipe(
//       svgstore({
//         inlineSvg: true,
//       })
//     )
//     .pipe(rename("sprite.svg"))
//     .pipe(gulp.dest("docs/img"));
// });

gulp.task("html", () => {
  return gulp
    .src("www/*.html")
    .pipe(posthtml([include()]))
    .pipe(gulp.dest("docs"));
});

gulp.task("server", () => {
  server.init({
    server: "docs",
  });

  gulp.watch("www/scss/**/*.scss", gulp.series("css"));
  gulp.watch("www/js/**/*.js", gulp.series("js"));
  // gulp.watch("www/img/icon-*.svg", gulp.series("sprite", "html"));
  gulp.watch("www/*.html", gulp.series("html", "refresh"));
});

gulp.task("copy", () => {
  return gulp
    .src(["www/fonts/**/*.{woff,woff2,ttf}", "www/img/*.svg"], {
      base: "www",
    })
    .pipe(gulp.dest("docs"));
});

gulp.task("clean", () => {
  return deleteAsync("docs");
});

gulp.task("js", () => {
  return gulp
    .src("www/js/*.js")
    .pipe(concat("main.js"))
    .pipe(
      minify({
        ext: {
          min: ".min.js",
        },
      })
    )
    .pipe(gulp.dest("docs/js"));
});

gulp.task(
  "build",
  gulp.series("clean", "copy", "images", "css",  "html", "js")
);

gulp.task("start", gulp.series("build", "server"));

gulp.task("refresh",  (done) => {
  server.reload();
  done();
});
