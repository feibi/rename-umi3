"use strict";

const path = require("path");
const fs = require("fs");

let fileList = [];
let dirList = [];

const listDir = (dir) => {
  let files = fs.readdirSync(dir);

  files.forEach((file) => {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      if (/\$.*/.test(file)) {
        const name = file.replace(/\$(.*)/, "[$1]");
        const oldSrc = path.join(dir, file);
        const newSrc = path.join(dir, name);
        dirList.push({
          oldSrc,
          newSrc,
          isDir: true,
        });
        console.log(oldSrc, " [dir] -> ", newSrc);
      }
      listDir(path.join(dir, file));
    } else {
      if (/\$.*\./.test(file)) {
        // console.log(file);
        const name = file.replace(/\$(.*)\./, "[$1].");
        const oldSrc = path.join(dir, file);
        const newSrc = path.join(dir, name);
        fileList.push({
          oldSrc,
          newSrc,
        });
        console.log(oldSrc, " [file] -> ", newSrc);
      }
    }
  });
};

function bootstrap() {
  const dir = process.argv[2];

  if (!dir || !fs.existsSync(dir)) {
    console.log("Invalid dir:", dir, ", please pass a valid dir");
    process.exit(1);
  }

  listDir(dir);
  console.log('------------------------')
  console.log("success file:", fileList.length);
  console.log("success dir:", dirList.length);

  fileList.forEach((f) => {
    fs.renameSync(f.oldSrc, f.newSrc);
  });
  dirList.reverse().forEach((f) => {
    fs.renameSync(f.oldSrc, f.newSrc);
  });
}

module.exports = {
  bootstrap,
};

// fs.renameSync(path.join("src", "c.id.js"), path.join("src", "c.$id.js"));
