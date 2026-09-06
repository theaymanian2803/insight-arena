import type { Verification } from "@/lib/corpus";

const styles: Record<Verification, string> = {
  verified: "bg-verify/10 text-verify ring-verify/25",
  disputed: "bg-dispute/10 text-dispute ring-dispute/25",
  unverified: "bg-white/55 text-unv ring-unv/25",
};

const dot: Record<Verification, string> = {
  verified: "bg-verify",
  disputed: "bg-dispute",
  unverified: "bg-unv",
};

export function StatusBadge({
  status,
  label,
  className = "",
}: {
  status: Verification;
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[10px] ring-1 ${styles[status]} ${className}`}
    >
      <span className={`size-1.5 shrink-0 rounded-full ${dot[status]}`} />
      {label ?? status}
    </span>
  );
}

export function StatusDot({ status }: { status: Verification }) {
  return <span className={`size-1.5 shrink-0 rounded-full ${dot[status]}`} />;
}

export function statusRing(status: Verification) {
  return status === "verified"
    ? "ring-verify/40"
    : status === "disputed"
      ? "ring-dispute/40"
      : "ring-unv/40";
}
