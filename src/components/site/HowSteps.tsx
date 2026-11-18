const STEPS = [
  {
    t: "Pick your area.",
    d: "Choose one county, a region, or the whole state.",
  },
  {
    t: "Pick your trades.",
    d: "Tell us the work you bid on.",
  },
  {
    t: "Get your bids by email, daily or weekly.",
    d: "New bids for your trades and area. Your first email covers the past week.",
  },
];

export function HowSteps({ expanded = false }: { expanded?: boolean }) {
  return (
    <ol className="mt-6 grid gap-4 md:grid-cols-3">
      {STEPS.map((s, i) => (
        <li key={s.t} className="card p-5">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full bg-badge font-bold text-brand"
            aria-hidden="true"
          >
            {i + 1}
          </span>
          <h3 className="mt-3 text-lg font-semibold text-ink">{s.t}</h3>
          <p className="mt-1 text-slate">{s.d}</p>
        </li>
      ))}
    </ol>
  );
}
