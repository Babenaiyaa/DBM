// middleware/upload.js
import multer from "multer";
import path from "path";

// Folder to store images
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/custom-orders/");
  },
  filename(req, file, cb) {
    cb(
      null,
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (!allowedTypes.includes(file.mimetype)) {
    cb(new Error("Only image files allowed"), false);
  } else {
    cb(null, true);
  }
};

export const uploadCustomOrderImages = multer({
  storage,
  fileFilter,
  limits: { files: 3 },
});
