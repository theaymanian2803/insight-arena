import { allCitations, type Entry, type Verification } from "@/lib/corpus";
import { StatusBadge } from "./StatusBadge";

export function CitationLedger({ entry, onClose }: { entry: Entry; onClose: () => void }) {
  const citations = allCitations(entry);
  const unique = Array.from(new Map(citations.map((c) => [c.detail, c])).values());
  const tally = (s: Verification) => unique.filter((c) => c.status === s).length;

  return (
    <div className="border-t border-white/60 bg-white/35 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-7 py-2.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist">
          Citation ledger
        </span>
        <StatusBadge status="verified" label={`${tally("verified")} verified`} />
        <StatusBadge status="disputed" label={`${tally("disputed")} disputed`} />
        <StatusBadge status="unverified" label={`${tally("unverified")} unverified`} />
        <button
          onClick={onClose}
          className="ml-auto rounded-md px-2 py-0.5 font-mono text-[10px] text-mist transition-colors hover:bg-white/50"
        >
          close
        </button>
      </div>
      <div className="max-h-44 overflow-y-auto border-t border-white/60 px-7 py-3">
        <ul className="space-y-2">
          {unique.map((c) => (
            <li key={c.detail} className="flex items-start justify-between gap-4">
              <p className="font-mono text-[11px] leading-relaxed text-steel">
                {c.detail} <span className="text-mist">· {c.archive}</span>
              </p>
              <StatusBadge status={c.status} className="shrink-0" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
