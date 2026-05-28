const fs = require("fs");
const path = require("path");
const multer = require("multer");
const AppError = require("../utils/AppError");

const uploadDir = path.resolve(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
    cb(null, safeName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 3 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new AppError("Arquivo precisa ser uma imagem.", 400, "INVALID_FILE"));
    }

    return cb(null, true);
  }
});

module.exports = upload;
