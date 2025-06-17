const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { error } = require("console");

const uploadPath = path.join(__dirname, "../../Uploads");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".jpg", ".jpeg", ".png"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) cb(null, true);
  else cb(new Error("Only images are allowed (.jpg, .jpeg, .png)"),false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;

