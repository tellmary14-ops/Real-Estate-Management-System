import type { ZodError, ZodIssue } from "zod";

const FIELD_LABELS: Record<string, string> = {
  title: "Title",
  description: "Description",
  price: "Price",
  currency: "Currency",
  address: "Address",
  city: "City",
  state: "State",
  country: "Country",
  zipCode: "Post code",
  bedrooms: "Bedrooms",
  bathrooms: "Bathrooms",
  areaSqft: "Area (sq ft)",
  category: "Property type",
  status: "Status",
  isFeatured: "Featured",
};

function friendlyMessage(issue: ZodIssue): string {
  const field = FIELD_LABELS[issue.path[0] as string] ?? String(issue.path[0] ?? "Field");

  if (issue.code === "too_small" && issue.type === "string") {
    return `${field} is too short — ${issue.message}`;
  }
  if (issue.code === "too_small" && issue.type === "number") {
    return `${field} must be greater than zero`;
  }
  if (issue.code === "invalid_type") {
    return `${field} is missing or invalid`;
  }
  if (issue.code === "invalid_enum_value") {
    return `${field}: please choose a valid option`;
  }

  return `${field}: ${issue.message}`;
}

export function formatValidationErrors(err: ZodError) {
  const errors = err.errors.map((issue) => ({
    field: issue.path.join(".") || "form",
    label: FIELD_LABELS[issue.path[0] as string] ?? issue.path.join("."),
    message: friendlyMessage(issue),
  }));

  const message =
    errors.length === 1
      ? errors[0].message
      : `Please fix the following: ${errors.map((e) => e.label).join(", ")}`;

  return { errors, message };
}
