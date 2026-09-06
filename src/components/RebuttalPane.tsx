import type { Entry } from "@/lib/corpus";
import { StatusBadge } from "./StatusBadge";

export function RebuttalPane({
  entry,
  activePerspective,
  onPerspectiveChange,
}: {
  entry: Entry;
  activePerspective: string | null;
  onPerspectiveChange: (p: string | null) => void;
}) {
  const perspectives = Array.from(new Set(entry.rebuttals.map((r) => r.perspective)));
  const shown = activePerspective
    ? entry.rebuttals.filter((r) => r.perspective === activePerspective)
    : entry.rebuttals;

  return (
    <section className="flex flex-1 flex-col overflow-hidden bg-white/10 backdrop-blur-xl">
      <div className="flex items-center gap-2 border-b border-white/60 px-6 py-2.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist">
          Rebuttals by perspective
        </span>
        <div className="ml-auto flex flex-wrap gap-1">
          {perspectives.map((p) => (
            <button
              key={p}
              onClick={() => onPerspectiveChange(activePerspective === p ? null : p)}
              className={`rounded-md px-2 py-0.5 font-mono text-[10px] transition-colors ${
                activePerspective === p
                  ? "bg-white/60 text-ink ring-1 ring-white/70"
                  : "text-mist hover:bg-white/50"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
        {shown.map((r) => (
          <div key={r.id} className="rounded-xl bg-white/55 p-4 ring-1 ring-white/70">
            <div className="flex items-center justify-between gap-2">
              <span className="min-w-0 truncate font-mono text-[10px] uppercase tracking-[0.15em] text-steel">
                {r.perspective} — claim
              </span>
              <StatusBadge status={r.status} />
            </div>
            <p className="mt-1.5 font-serif text-[14px] leading-snug text-ink">{r.claim}</p>

            {r.counter && (
              <div
                className={`mt-3 border-l-2 pl-3 ${
                  r.counter.status === "verified"
                    ? "border-verify/40"
                    : r.counter.status === "disputed"
                      ? "border-dispute/40"
                      : "border-unv/40"
                }`}
              >
                <div
                  className={`font-mono text-[9px] uppercase tracking-[0.15em] ${
                    r.counter.status === "verified"
                      ? "text-verify"
                      : r.counter.status === "disputed"
                        ? "text-dispute"
                        : "text-unv"
                  }`}
                >
                  Counter — {r.counter.author}
                </div>
                <p className="mt-1 text-[12.5px] leading-snug text-steel">{r.counter.body}</p>
              </div>
            )}

            <div className="mt-3 space-y-1.5 border-t border-white/70 pt-2.5">
              {r.citations.map((c) => (
                <p key={c.id} className="font-mono text-[10px] leading-relaxed text-mist">
                  {c.detail} <span className="text-steel">· {c.archive}</span>
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
