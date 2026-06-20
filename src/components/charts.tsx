function createPath(values: number[], width: number, height: number) {
  if (values.length === 0) {
    return "";
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);
  const step = values.length > 1 ? width / (values.length - 1) : width;

  return values
    .map((value, index) => {
      const x = index * step;
      const normalized = (value - min) / range;
      const y = height - normalized * height;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

export function MiniLineChart({ values }: { values: number[] }) {
  const width = 640;
  const height = 220;
  const padding = 14;
  const path = createPath(values, width - padding * 2, height - padding * 2);

  const points = values.map((value, index) => {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = Math.max(max - min, 1);
    const x = padding + (index * (width - padding * 2)) / Math.max(values.length - 1, 1);
    const y = padding + (1 - (value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-56 w-full">
      <defs>
        <linearGradient id="line-gradient" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
        <linearGradient id="area-gradient" x1="0%" x2="0%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <path
        d={`${path} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`}
        fill="url(#area-gradient)"
      />
      <path d={path} fill="none" stroke="url(#line-gradient)" strokeWidth="3" strokeLinecap="round" />
      <polyline fill="none" points={points.join(" ")} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
    </svg>
  );
}

export function MiniBarChart({
  values,
  colors
}: {
  values: number[];
  colors: string[];
}) {
  const max = Math.max(...values, 1);

  return (
    <div className="flex h-56 items-end gap-3">
      {values.map((value, index) => (
        <div key={`${value}-${index}`} className="flex flex-1 flex-col items-center gap-3">
          <div className="flex h-44 w-full items-end justify-center rounded-3xl border border-white/5 bg-white/5 p-2">
            <div
              className="w-full rounded-2xl"
              style={{
                height: `${Math.round((value / max) * 100)}%`,
                background: colors[index % colors.length]
              }}
            />
          </div>
          <div className="text-xs text-slate-400">Q{index + 1}</div>
        </div>
      ))}
    </div>
  );
}