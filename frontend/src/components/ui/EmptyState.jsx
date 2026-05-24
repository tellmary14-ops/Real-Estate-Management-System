export default function EmptyState({ title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center card border-dashed">
      <div className="w-14 h-14 rounded-full bg-[var(--color-brand-soft)] flex items-center justify-center mb-5">
        <span className="text-xl text-[var(--color-brand)]">◇</span>
      </div>
      <h3 className="font-display text-2xl font-semibold text-[var(--color-ink)] mb-2">{title}</h3>
      <p className="text-body max-w-md mb-6">{message}</p>
      {action}
    </div>
  );
}
