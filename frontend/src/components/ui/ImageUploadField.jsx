import { useId, useRef } from "react";

export default function ImageUploadField({ files, onChange, error }) {
  const inputId = useId();
  const inputRef = useRef(null);

  const handlePick = (e) => {
    const picked = Array.from(e.target.files ?? []);
    onChange(picked);
  };

  const removeAt = (index) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="md:col-span-2 space-y-3">
      <label htmlFor={inputId} className="block text-sm font-semibold text-slate-700">
        Photos
      </label>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={handlePick}
      />
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => inputRef.current?.click()}
        >
          Choose images
        </button>
        <span className="text-sm text-slate-500">
          {files.length ? `${files.length} selected` : "JPG or PNG, up to 10 images"}
        </span>
      </div>
      {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
      {files.length > 0 && (
        <ul className="flex flex-wrap gap-3">
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`} className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt=""
                className="h-20 w-20 rounded-lg object-cover border border-slate-200"
              />
              <button
                type="button"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-slate-900 text-white text-xs font-bold"
                onClick={() => removeAt(index)}
                aria-label="Remove image"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
