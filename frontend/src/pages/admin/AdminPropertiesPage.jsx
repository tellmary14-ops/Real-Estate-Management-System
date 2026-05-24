import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { propertyApi } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import ImageUploadField from "../../components/ui/ImageUploadField";
import { formatPrice, formatCategory, formatStatus } from "../../utils/format";
import { propertyImage, propertyImageFallback, propertyImageKey } from "../../constants/images";
import { locale } from "../../constants/locale";
import { parseApiErrors, fieldLabel } from "../../utils/apiErrors";
import { logger } from "../../utils/logger";

const EMPTY_FORM = {
  title: "",
  description: "",
  price: "",
  address: locale.addressLine,
  city: locale.city,
  category: "HOUSE",
  status: "AVAILABLE",
  bedrooms: "0",
  bathrooms: "0",
};

const CATEGORIES = ["HOUSE", "APARTMENT", "VILLA", "LAND", "COMMERCIAL", "OTHER"];
const STATUSES = ["AVAILABLE", "PENDING", "SOLD"];

function clientValidate(form) {
  const errors = {};
  if (!form.title.trim() || form.title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters";
  }
  if (!form.description.trim() || form.description.trim().length < 10) {
    errors.description = "Description must be at least 10 characters";
  }
  const price = Number(form.price);
  if (!form.price || Number.isNaN(price) || price <= 0) {
    errors.price = "Enter a price greater than zero";
  }
  if (!form.city.trim() || form.city.trim().length < 2) {
    errors.city = "Enter the city name";
  }
  if (!form.address.trim() || form.address.trim().length < 3) {
    errors.address = "Enter the full street address";
  }
  return errors;
}

function propertyToForm(p) {
  return {
    title: p.title ?? "",
    description: p.description ?? "",
    price: String(p.price ?? ""),
    address: p.address ?? "",
    city: p.city ?? locale.city,
    category: p.category ?? "HOUSE",
    status: p.status ?? "AVAILABLE",
    bedrooms: String(p.bedrooms ?? 0),
    bathrooms: String(p.bathrooms ?? 0),
  };
}

function buildJsonBody(form) {
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    price: Number(form.price),
    address: form.address.trim(),
    city: form.city.trim(),
    category: form.category,
    status: form.status,
    bedrooms: Number(form.bedrooms || 0),
    bathrooms: Number(form.bathrooms || 0),
    currency: locale.currency,
    country: locale.country,
    state: locale.state,
  };
}

function buildFormData(form, images) {
  const fd = new FormData();
  fd.append("title", form.title.trim());
  fd.append("description", form.description.trim());
  fd.append("price", String(form.price));
  fd.append("address", form.address.trim());
  fd.append("city", form.city.trim());
  fd.append("category", form.category);
  fd.append("status", form.status);
  fd.append("bedrooms", form.bedrooms || "0");
  fd.append("bathrooms", form.bathrooms || "0");
  fd.append("currency", locale.currency);
  fd.append("country", locale.country);
  fd.append("state", locale.state);
  images.forEach((file) => fd.append("images", file));
  return fd;
}

function PropertyThumb({ property }) {
  const src = propertyImage(property);
  const fallback = propertyImageFallback(property);

  return (
    <img
      key={`${property.id}-${propertyImageKey(property)}`}
      src={src}
      alt=""
      className="w-24 h-18 rounded-xl object-cover shrink-0 bg-slate-100"
      onError={(e) => {
        if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
      }}
    />
  );
}

function Field({ label, error, children, className = "" }) {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-sm text-red-600 font-medium">{error}</p>}
    </div>
  );
}

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingProperty, setEditingProperty] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [images, setImages] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const res = await propertyApi.list({ limit: "100" });
    const items = res.data?.data ?? [];
    setProperties(items);
    logger.info("admin:properties:loaded", { count: items.length });
    return items;
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setEditingProperty(null);
    setForm(EMPTY_FORM);
    setImages([]);
    setFieldErrors({});
    setShowForm(true);
  };

  const openEdit = (property) => {
    setEditingId(property.id);
    setEditingProperty(property);
    setForm(propertyToForm(property));
    setImages([]);
    setFieldErrors({});
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setEditingProperty(null);
    setForm(EMPTY_FORM);
    setImages([]);
    setFieldErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const localErrors = clientValidate(form);
    if (Object.keys(localErrors).length) {
      setFieldErrors(localErrors);
      toast.error("Please fix the highlighted fields");
      return;
    }

    setSaving(true);
    setFieldErrors({});

    try {
      let saved;
      if (editingId) {
        logger.info("admin:property:update", { id: editingId, withImages: images.length > 0 });
        const body = images.length > 0 ? buildFormData(form, images) : buildJsonBody(form);
        const res = await propertyApi.update(editingId, body);
        saved = res.data?.data;
        logger.info("admin:property:update:response", { title: saved?.title, images: saved?.images?.length });
        if (!saved?.title || saved.title !== form.title.trim()) {
          throw new Error("Your changes did not save. Stop the old server on port 4000 and restart the backend.");
        }
        toast.success(images.length > 0 ? "Listing and photos updated" : "Listing updated");
      } else {
        logger.info("admin:property:create", { withImages: images.length > 0 });
        const res = await propertyApi.create(buildFormData(form, images));
        saved = res.data?.data;
        toast.success("Property listed");
      }

      if (saved?.id) {
        setProperties((prev) => {
          const exists = prev.some((p) => p.id === saved.id);
          if (exists) return prev.map((p) => (p.id === saved.id ? { ...p, ...saved } : p));
          return [saved, ...prev];
        });
      }

      closeForm();
      await load();
    } catch (err) {
      const { fieldErrors: apiFieldErrors, summary } = parseApiErrors(err);
      setFieldErrors((prev) => ({ ...prev, ...apiFieldErrors }));
      toast.error(summary);
      logger.error("admin:property:save:error", summary);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this listing?")) return;
    await propertyApi.remove(id);
    toast.success("Removed");
    load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dash-page-stack">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => (showForm ? closeForm() : openCreate())}
          className="dash-btn-primary"
        >
          {showForm ? "Cancel" : "Add property"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="dash-panel dash-panel-pad space-y-6">
          <div>
            <h2 className="dash-panel-title">{editingId ? "Edit listing" : "New listing"}</h2>
            <p className="text-sm text-slate-500 mt-1">
              {editingId
                ? "Update details below. Add new photos if you like — existing photos stay as they are."
                : "Fill in each field. We will tell you exactly what needs fixing if something is wrong."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <Field label="Title *" error={fieldErrors.title} className="md:col-span-2">
              <input
                className={`input-field ${fieldErrors.title ? "border-red-400" : ""}`}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Maitama Luxury Villa"
              />
            </Field>

            <Field label="Description *" error={fieldErrors.description} className="md:col-span-2">
              <textarea
                rows={4}
                className={`input-field ${fieldErrors.description ? "border-red-400" : ""}`}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe the home, rooms, and neighbourhood (at least 10 characters)"
              />
            </Field>

            <Field label="Price (₦) *" error={fieldErrors.price}>
              <input
                type="number"
                min="1"
                className={`input-field ${fieldErrors.price ? "border-red-400" : ""}`}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="e.g. 95000000"
              />
            </Field>

            <Field label="Property type *" error={fieldErrors.category}>
              <select
                className="input-field"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {formatCategory(c)}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="City *" error={fieldErrors.city}>
              <input
                className={`input-field ${fieldErrors.city ? "border-red-400" : ""}`}
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </Field>

            <Field label="Status" error={fieldErrors.status}>
              <select
                className="input-field"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {formatStatus(s)}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Address *" error={fieldErrors.address} className="md:col-span-2">
              <input
                className={`input-field ${fieldErrors.address ? "border-red-400" : ""}`}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </Field>

            <Field label="Bedrooms" error={fieldErrors.bedrooms}>
              <input
                type="number"
                min="0"
                className="input-field"
                value={form.bedrooms}
                onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
              />
            </Field>

            <Field label="Bathrooms" error={fieldErrors.bathrooms}>
              <input
                type="number"
                min="0"
                className="input-field"
                value={form.bathrooms}
                onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
              />
            </Field>

            {editingProperty?.images?.length > 0 && images.length === 0 && (
              <div className="md:col-span-2">
                <p className="text-sm font-semibold text-slate-700 mb-2">Current photos</p>
                <div className="flex flex-wrap gap-3">
                  {editingProperty.images.map((img) => (
                    <img
                      key={img.id}
                      src={propertyImage({ ...editingProperty, images: [img] })}
                      alt=""
                      className="h-20 w-20 rounded-lg object-cover border border-slate-200"
                      onError={(e) => {
                        e.currentTarget.src = propertyImageFallback(editingProperty);
                      }}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Choose new images below to replace these photos.
                </p>
              </div>
            )}

            <ImageUploadField
              files={images}
              onChange={setImages}
              error={fieldErrors.images}
            />
          </div>

          {Object.keys(fieldErrors).length > 0 && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              <p className="font-semibold mb-1">Please fix:</p>
              <ul className="list-disc pl-5 space-y-0.5">
                {Object.entries(fieldErrors).map(([key, msg]) => (
                  <li key={key}>
                    {fieldLabel(key)}: {msg}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button type="submit" disabled={saving} className="dash-btn-primary w-full sm:w-auto justify-center">
            {saving ? "Saving…" : editingId ? "Save changes" : "Save listing"}
          </button>
        </form>
      )}

      <div className="dash-panel">
        <div className="dash-panel-header">
          <h2 className="dash-panel-title">All properties</h2>
          <p className="text-sm text-slate-500">{properties.length} listings</p>
        </div>
        <ul>
          {properties.map((p) => (
            <li key={`${p.id}-${propertyImageKey(p)}`} className="dash-row-card flex-wrap">
              <PropertyThumb property={p} />
              <div className="flex-1 min-w-[200px]">
                <p className="font-semibold text-slate-900">{p.title}</p>
                <p className="text-sm text-slate-500 mt-1">
                  {formatPrice(p.price, p.currency)} · {formatCategory(p.category)} · {formatStatus(p.status)}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {p.city}, {p.country}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => openEdit(p)}
                  className="text-sm font-semibold text-[var(--color-brand)] hover:underline"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p.id)}
                  className="text-sm font-semibold text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
