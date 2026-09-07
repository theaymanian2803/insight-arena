import { createContext, useContext } from "react";
import { entries as corpusEntries, type Verification } from "@/lib/corpus";

export type AdminEntry = {
  id: string;
  kind: "verse" | "premise";
  title: string;
  originalText: string;
  translation: string;
  category: string;
  subCategory: string;
  reference: string;
  tags: string[];
};

export type AdminCommentary = {
  id: string;
  entryId: string;
  scholar: string;
  text: string;
  book: string;
  volumePage: string;
  sourceRef: string;
  status: Verification;
};

export type AdminRebuttal = {
  id: string;
  entryId: string;
  opponent: string;
  stance: string;
  text: string;
  counterRefs: string;
  status: Verification;
};

export type SourceStatus = "verified" | "pending" | "unverified";

export type AdminSource = {
  id: string;
  label: string;
  detail: string;
  kind: "book" | "article" | "manuscript" | "scholar";
  status: SourceStatus;
  archive: string;
};

export type AdminCategory = { id: string; label: string; subs: string[] };

export type AdminData = {
  entries: AdminEntry[];
  commentaries: AdminCommentary[];
  rebuttals: AdminRebuttal[];
  sources: AdminSource[];
  categories: AdminCategory[];
  tags: string[];
};

export const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

const categoryLabel: Record<string, string> = {
  religious: "Religion",
  philosophy: "Philosophy",
  ethics: "Ethics",
};

const statusToSource: Record<Verification, SourceStatus> = {
  verified: "verified",
  disputed: "pending",
  unverified: "unverified",
};

export function seedData(): AdminData {
  const entries: AdminEntry[] = corpusEntries.map((e) => {
    const parts = e.breadcrumb.split("/").map((p) => p.trim());
    return {
      id: e.id,
      kind: e.kind,
      title: e.title,
      originalText: e.primary,
      translation: e.secondary,
      category: categoryLabel[e.collection] ?? e.collection,
      subCategory: parts[parts.length - 1] ?? "",
      reference: e.subtitle,
      tags: e.map.nodes.slice(0, 3).map((n) => n.label),
    };
  });

  const commentaries: AdminCommentary[] = corpusEntries.flatMap((e) =>
    e.sections.flatMap((s) =>
      s.citations.map((c) => ({
        id: uid("com"),
        entryId: e.id,
        scholar: c.label.replace(/\s\d{4}.*$/, ""),
        text: s.body,
        book: c.detail,
        volumePage: c.detail.split(",").slice(-1)[0]?.trim() ?? "",
        sourceRef: c.archive,
        status: c.status,
      })),
    ),
  );

  const rebuttals: AdminRebuttal[] = corpusEntries.flatMap((e) =>
    e.rebuttals.map((r) => ({
      id: uid("reb"),
      entryId: e.id,
      opponent: r.counter?.author ?? r.perspective,
      stance: r.perspective,
      text: r.counter?.body ?? r.claim,
      counterRefs: r.citations.map((c) => c.label).join("; "),
      status: r.status,
    })),
  );

  const seen = new Set<string>();
  const sources: AdminSource[] = [];
  for (const e of corpusEntries) {
    for (const c of [
      ...e.sections.flatMap((s) => s.citations),
      ...e.rebuttals.flatMap((r) => r.citations),
    ]) {
      if (seen.has(c.label)) continue;
      seen.add(c.label);
      sources.push({
        id: uid("src"),
        label: c.label,
        detail: c.detail,
        kind: "book",
        status: statusToSource[c.status],
        archive: c.archive,
      });
    }
  }

  const tags = Array.from(new Set(entries.flatMap((e) => e.tags)));

  return {
    entries,
    commentaries,
    rebuttals,
    sources,
    categories: [
      { id: "religion", label: "Religion", subs: ["Torah", "Gospels", "Qur'an"] },
      { id: "philosophy", label: "Philosophy", subs: ["Ethics", "Metaphysics", "Logic"] },
      { id: "ethics", label: "Ethics", subs: ["Stoicism", "Virtue ethics"] },
    ],
    tags,
  };
}

export type AdminStore = {
  data: AdminData;
  update: (fn: (draft: AdminData) => AdminData) => void;
  reset: () => void;
};

export const AdminContext = createContext<AdminStore | null>(null);

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside the admin layout");
  return ctx;
}

export const STORAGE_KEY = "scholia-admin-v1";
