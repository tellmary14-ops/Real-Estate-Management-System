import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { env } from "../config/env.js";
import { cloudinary, isCloudinaryConfigured } from "../config/cloudinary.js";
import { logger } from "./logger.js";

const UPLOAD_ROOT = path.join(process.cwd(), "uploads");
const PROPERTIES_DIR = path.join(UPLOAD_ROOT, "properties");

/** Public URL path (proxied by Vite to the API in dev). */
export function propertyImagePublicUrl(filename: string) {
  return `${env.apiPrefix}/uploads/properties/${filename}`;
}

async function saveLocal(buffer: Buffer, originalName: string) {
  await fs.mkdir(PROPERTIES_DIR, { recursive: true });
  const ext = path.extname(originalName || "") || ".jpg";
  const safeExt = [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext.toLowerCase()) ? ext : ".jpg";
  const filename = `${crypto.randomUUID()}${safeExt}`;
  await fs.writeFile(path.join(PROPERTIES_DIR, filename), buffer);
  const url = propertyImagePublicUrl(filename);
  logger.info({ step: "image:local:saved", filename, url });
  return { url, publicId: filename };
}

async function saveCloudinary(buffer: Buffer, folder: string) {
  return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `golden-eggs/${folder}`, resource_type: "image" },
      (err, result) => {
        if (err || !result) return reject(err ?? new Error("Upload failed"));
        logger.info({ step: "image:cloudinary:saved", publicId: result.public_id });
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

export async function storePropertyImage(
  buffer: Buffer,
  originalName: string
): Promise<{ url: string; publicId: string }> {
  if (isCloudinaryConfigured) {
    return saveCloudinary(buffer, "properties");
  }
  return saveLocal(buffer, originalName);
}

export function uploadsRootPath() {
  return UPLOAD_ROOT;
}
