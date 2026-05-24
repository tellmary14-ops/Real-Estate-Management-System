import type { Request, Response, NextFunction } from "express";
import multer from "multer";

const storage = multer.memoryStorage();

export const uploadImages = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed"));
      return;
    }
    cb(null, true);
  },
});

/** Only parse multipart when the client actually sends files (keeps JSON PATCH body intact). */
export function uploadImagesOptional(req: Request, res: Response, next: NextFunction) {
  const contentType = req.headers["content-type"] ?? "";
  if (!contentType.includes("multipart/form-data")) {
    return next();
  }
  return uploadImages.array("images", 10)(req, res, next);
}
