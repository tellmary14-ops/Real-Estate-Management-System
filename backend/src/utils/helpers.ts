import crypto from "crypto";

export function omitPassword<T extends { password?: string }>(user: T) {
  const { password: _, ...rest } = user;
  return rest;
}

export function generateInvoiceNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `INV-${date}-${rand}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-");
}
