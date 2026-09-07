import type { ReactNode } from "react";

export function Panel({
  title,
  subtitle,
  action,
  children,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl bg-white/45 ring-1 ring-white/70 backdrop-blur-xl ${className}`}
    >
      {(title || action) && (
        <header className="flex items-start justify-between gap-3 border-b border-white/60 px-5 py-3.5">
          <div className="min-w-0">
            {title && (
              <h2 className="font-serif text-[15px] leading-tight font-medium text-ink">{title}</h2>
            )}
            {subtitle && <p className="mt-0.5 text-[12px] text-mist">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Field({
  label,
  hint,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-mist">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1 text-[11px] text-mist">{hint}</p>}
    </label>
  );
}

const control =
  "w-full rounded-lg bg-white/70 px-3 py-2 text-[13px] text-ink ring-1 ring-white/80 outline-none transition-shadow placeholder:text-unv focus:ring-2 focus:ring-ring/50";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${control} ${props.className ?? ""}`} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${control} leading-relaxed ${props.className ?? ""}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${control} ${props.className ?? ""}`} />;
}

export function Button({
  variant = "solid",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "solid" | "ghost" | "danger" }) {
  const styles =
    variant === "solid"
      ? "bg-ink text-paper ring-ink/10 hover:opacity-90"
      : variant === "danger"
        ? "bg-destructive/10 text-destructive ring-destructive/20 hover:bg-destructive/15"
        : "bg-white/60 text-steel ring-white/80 hover:bg-white/80";
  return (
    <button
      {...props}
      className={`rounded-lg px-3 py-1.5 text-[12px] font-medium ring-1 transition ${styles} ${className}`}
    />
  );
}

export function TagPicker({
  options,
  value,
  onChange,
  onCreate,
}: {
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
  onCreate?: (tag: string) => void;
}) {
  const toggle = (t: string) =>
    onChange(value.includes(t) ? value.filter((v) => v !== t) : [...value, t]);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {options.map((t) => {
          const on = value.includes(t);
          return (
            <button
              key={t}
              type="button"
              onClick={() => toggle(t)}
              className={`rounded-full px-2.5 py-1 font-mono text-[10px] ring-1 transition ${
                on
                  ? "bg-ink text-paper ring-ink/20"
                  : "bg-white/60 text-steel ring-white/80 hover:bg-white/85"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>
      {onCreate && (
        <input
          placeholder="New tag, then press Enter"
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            const v = e.currentTarget.value.trim();
            if (!v) return;
            onCreate(v);
            if (!value.includes(v)) onChange([...value, v]);
            e.currentTarget.value = "";
          }}
          className={control}
        />
      )}
    </div>
  );
}

export function Stat({ label, value, note }: { label: string; value: number; note?: string }) {
  return (
    <div className="rounded-2xl bg-white/45 px-5 py-4 ring-1 ring-white/70 backdrop-blur-xl">
      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-mist">{label}</div>
      <div className="mt-1.5 font-serif text-3xl leading-none font-medium text-ink">{value}</div>
      {note && <div className="mt-1.5 text-[11px] text-mist">{note}</div>}
    </div>
  );
}

export function EmptyRow({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg bg-white/40 px-3 py-4 text-center text-[12px] text-mist ring-1 ring-white/70">
      {children}
    </p>
  );
}
