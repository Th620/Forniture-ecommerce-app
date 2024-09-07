const fs = require("fs");
const path = require("path");

const fileRemover = (filesNames = []) => {
  filesNames.forEach((fileName) => {
    fs.unlink(path.join(__dirname, "../uploads", fileName), function (err) {
      if (err && err.code === "ENOENT") {
        console.log(`file ${fileName} doesn't exist`);
      } else if (err) {
        console.log(err.message);
        console.log("Error occured when trying to remove");
      } else {
        console.log("file removed");
      }
    });
  });
};

const fileRemoverSingleFile = (fileName) => {
  fs.unlink(path.join(__dirname, "../uploads", fileName), function (err) {
    if (err && err.code === "ENOENT") {
      console.log(`file ${fileName} doesn't exist`);
    } else if (err) {
      console.log(err.message);
      console.log("Error occured when trying to remove");
    } else {
      console.log("file removed");
    }
  });
};

const fileterImagesToRemove = (previousImages, images = []) => {
  let imagesToRemove = previousImages.filter((image) => {
    return !images.includes(image);
  });
  return imagesToRemove;
};

module.exports = { fileRemover, fileterImagesToRemove, fileRemoverSingleFile };
