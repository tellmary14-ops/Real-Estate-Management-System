export default function LoadingSpinner({ label = "Loading…" }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4" role="status" aria-live="polite">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-[var(--color-border)]" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--color-brand)] animate-spin" />
      </div>
      <p className="text-caption">{label}</p>
    </div>
  );
}
