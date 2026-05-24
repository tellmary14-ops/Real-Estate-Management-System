/** Lightweight SVG charts — no external chart library */

export function AreaChart({ data, height = 160 }) {
  if (!data?.length) return null;
  const max = Math.max(...data.map((d) => d.value), 1);
  const w = 100;
  const h = 100;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1 || 1)) * w;
    const y = h - (d.value / max) * (h - 8) - 4;
    return `${x},${y}`;
  });
  const line = points.join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;

  return (
    <div className="w-full" style={{ height }}>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-full">
        <path d={area} fill="var(--color-brand)" fillOpacity="0.12" />
        <polyline
          points={line}
          fill="none"
          stroke="var(--color-brand)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="flex justify-between mt-3 px-0.5">
        {data.map((d) => (
          <span key={d.label} className="text-[11px] text-[var(--color-ink-faint)]">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function BarChart({ data, height = 160 }) {
  if (!data?.length) return null;
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="w-full flex items-end justify-between gap-2" style={{ height }}>
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
          <div
            className="w-full max-w-[36px] rounded-t-md bg-[var(--color-brand)] transition-all"
            style={{ height: `${Math.max((d.value / max) * 100, d.value > 0 ? 8 : 2)}%` }}
            title={`${d.value}`}
          />
          <span className="text-[11px] text-[var(--color-ink-faint)]">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export function DonutChart({ segments, size = 140, listingsTotal }) {
  const visible = segments.filter((s) => s.value > 0);
  const segmentSum = visible.reduce((s, x) => s + x.value, 0);
  const total = segmentSum > 0 ? segmentSum : listingsTotal ?? 0;
  const arcTotal = segmentSum > 0 ? segmentSum : 1;
  let offset = 0;
  const r = 40;
  const c = 2 * Math.PI * r;

  const arcs = visible.map((seg) => {
    const pct = seg.value / arcTotal;
    const dash = pct * c;
    const arc = (
      <circle
        key={seg.label}
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke={seg.color}
        strokeWidth="12"
        strokeDasharray={`${dash} ${c - dash}`}
        strokeDashoffset={-offset}
        transform="rotate(-90 50 50)"
      />
    );
    offset += dash;
    return arc;
  });

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#f1f5f9" strokeWidth="12" />
        {arcs}
        <text x="50" y="48" textAnchor="middle" className="fill-[var(--color-ink)] text-[10px] font-semibold">
          {total}
        </text>
        <text x="50" y="58" textAnchor="middle" className="fill-[var(--color-ink-faint)] text-[6px]">
          listings
        </text>
      </svg>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
        {(visible.length ? visible : segments).map((s) => (
          <div key={s.label} className="flex items-center gap-1.5 text-caption">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
            {s.label} ({s.value})
          </div>
        ))}
      </div>
    </div>
  );
}
