import { useState } from "react";
import type { Citation, Entry } from "@/lib/corpus";
import { StatusBadge, StatusDot } from "./StatusBadge";

function CitationRow({ c }: { c: Citation }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-1">
        <StatusDot status={c.status} />
      </span>
      <p className="font-mono text-[11px] leading-relaxed text-steel">
        {c.detail} <span className="text-mist">· {c.archive}</span>
      </p>
    </div>
  );
}

export function PrimaryPane({ entry }: { entry: Entry }) {
  const [open, setOpen] = useState<string[]>([entry.sections[0]?.id ?? ""]);
  const toggle = (id: string) =>
    setOpen((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <section className="flex w-[46%] flex-col overflow-hidden border-r border-white/50 bg-white/20 backdrop-blur-2xl">
      <div className="flex items-center justify-between border-b border-white/60 px-6 py-2.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist">
          Primary text
        </span>
        <span className="font-mono text-[10px] text-mist">{entry.breadcrumb.split("/").pop()}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-7 py-6">
        <p className="font-serif text-[17px] leading-[1.75] text-pretty text-ink">
          {entry.primary}
        </p>
        <p className="mt-4 font-serif text-[15px] leading-[1.7] text-pretty italic text-steel">
          {entry.secondary}
        </p>

        {entry.sections.map((s) => {
          const isOpen = open.includes(s.id);
          return (
            <div key={s.id} className="mt-7">
              <button
                onClick={() => toggle(s.id)}
                className="flex w-full items-center gap-2 border-b border-white/60 pb-2 text-left"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist">
                  {s.title}
                </span>
                <span className="ml-auto font-mono text-[10px] text-mist">
                  {isOpen ? "− collapse" : `+ ${s.citations.length} cited`}
                </span>
              </button>
              {isOpen && (
                <div className="pt-3">
                  <p className="text-[13px] leading-[1.7] text-pretty text-steel">{s.body}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {s.citations.map((c) => (
                      <StatusBadge
                        key={c.id}
                        status={c.status}
                        label={`${c.label} · ${c.status}`}
                        className="px-2.5 py-1"
                      />
                    ))}
                  </div>
                  <div className="mt-3 space-y-2.5">
                    {s.citations.map((c) => (
                      <CitationRow key={`row-${c.id}`} c={c} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
