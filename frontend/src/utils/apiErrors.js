const FIELD_LABELS = {
  title: "Title",
  description: "Description",
  price: "Price",
  address: "Address",
  city: "City",
  category: "Property type",
  status: "Status",
  images: "Images",
  form: "Form",
};

export function parseApiErrors(error) {
  const data = error?.response?.data;
  const list = Array.isArray(data?.errors) ? data.errors : [];
  const fieldErrors = {};

  list.forEach((item) => {
    const key = item.field || "form";
    fieldErrors[key] = item.message || item.label || "Invalid value";
  });

  const messages = list.map((item) => item.message).filter(Boolean);
  const summary =
    messages.length > 0
      ? messages.join(" · ")
      : data?.message || error?.message || "Something went wrong. Please try again.";

  return { fieldErrors, summary, list };
}

export function fieldLabel(field) {
  return FIELD_LABELS[field] || field;
}
