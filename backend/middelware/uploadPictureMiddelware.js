const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cd) => {
    cd(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cd) => {
    cd(null, `${Date.now()}-${file.originalname.replace(/[\s\:]/g, "-")}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cd) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".jpg" && ext !== ".png" && ext !== ".jpeg" && ext !== ".svg") {
      return cd(new Error("only images are allowed"));
    }
    cd(null, true);
  },
});

module.exports = { upload };
