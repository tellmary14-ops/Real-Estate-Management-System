import "dotenv/config";

function requireSecret(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Missing required secret: ${key}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: 4000,
  apiPrefix: "/api/v1",
  frontendUrl: "http://localhost:5173",
  appName: "Golden Eggs Estate",

  databaseUrl: requireSecret(
    "DATABASE_URL",
    "postgresql://postgres@localhost:5432/golden_eggs_estates"
  ),

  jwtAccessSecret: requireSecret("JWT_ACCESS_SECRET", "dev-access-secret-change-me"),
  jwtRefreshSecret: requireSecret("JWT_REFRESH_SECRET", "dev-refresh-secret-change-me"),
  jwtAccessExpiresIn: "15m",
  jwtRefreshExpiresIn: "7d",

  bcryptSaltRounds: 12,

  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY ?? "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET ?? "",

  paystackSecretKey: process.env.PAYSTACK_SECRET_KEY ?? "",
  paystackPublicKey: process.env.PAYSTACK_PUBLIC_KEY ?? "",

  smtpHost: process.env.SMTP_HOST ?? "",
  smtpPort: 587,
  smtpUser: process.env.SMTP_USER ?? "",
  smtpPass: process.env.SMTP_PASS ?? "",
  emailFrom: process.env.EMAIL_FROM ?? "noreply@goldeneggsestate.com",
} as const;

export const isCloudinaryConfigured =
  Boolean(env.cloudinaryCloudName && env.cloudinaryApiKey && env.cloudinaryApiSecret);
