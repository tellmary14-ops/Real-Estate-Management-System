const CATEGORY_LABELS = {
  HOUSE: "House",
  APARTMENT: "Apartment",
  VILLA: "Villa",
  LAND: "Land",
  COMMERCIAL: "Commercial",
  OTHER: "Other",
};

const STATUS_LABELS = {
  AVAILABLE: "Available",
  PENDING: "Pending",
  SOLD: "Sold",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
};

export function formatPrice(amount, currency = "NGN") {
  const code = currency || "NGN";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: code,
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

export function formatCategory(category) {
  return CATEGORY_LABELS[category] ?? category;
}

export function formatStatus(status) {
  return STATUS_LABELS[status] ?? status;
}
