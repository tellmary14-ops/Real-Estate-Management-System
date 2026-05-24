import { v2 as cloudinary } from "cloudinary";
import { env, isCloudinaryConfigured } from "./env.js";
import { logger } from "../utils/logger.js";

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: env.cloudinaryCloudName,
    api_key: env.cloudinaryApiKey,
    api_secret: env.cloudinaryApiSecret,
  });
  logger.info({ step: "cloudinary:configured" });
} else {
  logger.warn({ step: "cloudinary:not_configured", message: "Image uploads saved locally in uploads/ folder" });
}

export { cloudinary, isCloudinaryConfigured };
