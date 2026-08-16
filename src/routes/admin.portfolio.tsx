import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import {
  AdminButton,
  EmptyState,
  Field,
  Modal,
  PageHead,
  Panel,
  Pill,
  Select,
  Switch,
  TextArea,
  TextInput,
} from "@/components/admin-ui";
import {
  useAdmin,
  savePortfolio,
  deletePortfolio,
  emptyPortfolio,
  type PortfolioDraft,
  type PortfolioItem,
} from "@/lib/admin-store";

export const Route = createFileRoute("/admin/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — SiteReadyPro Admin" },
      {
        name: "description",
        content: "Manage custom project case studies — add clients, categories, year, summary and live links.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Portfolio — SiteReadyPro Admin" },
      { property: "og:description", content: "Case study manager for custom client projects." },
    ],
  }),
  component: PortfolioAdmin,
});

const cats = ["SaaS", "Hospitality", "Agency", "E-commerce", "Portfolio", "Custom"];

function PortfolioAdmin() {
  const { portfolio } = useAdmin();
  const [editing, setEditing] = useState<{ id?: string; draft: PortfolioDraft } | null>(null);

  return (
    <div>
      <PageHead
        eyebrow="Case studies"
        title="Portfolio."
        sub="Showcase of custom projects — keep them as drafts or publish them live."
        action={
          <AdminButton variant="clay" onClick={() => setEditing({ draft: emptyPortfolio() })}>
            <Plus className="h-4 w-4" /> New case study
          </AdminButton>
        }
      />

      {portfolio.length === 0 ? (
        <EmptyState title="No case studies yet" sub="Add your first project." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {portfolio.map((p) => (
            <Panel key={p.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-editorial text-xl">{p.title}</span>
                    <Pill tone={p.status === "published" ? "clay" : "muted"}>
                      {p.status === "published" ? "Published" : "Draft"}
                    </Pill>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {p.client} · {p.category} · {p.year}
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{p.blurb}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-foreground/8 pt-4">
                {p.liveUrl && (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-4 py-2 text-sm hover:bg-foreground/5"
                  >
                    <ExternalLink className="h-4 w-4" /> Live
                  </a>
                )}
                <div className="ml-auto flex gap-2">
                  <AdminButton
                    variant="ghost"
                    ariaLabel={`Edit ${p.title}`}
                    onClick={() => setEditing({ id: p.id, draft: toDraft(p) })}
                  >
                    <Pencil className="h-4 w-4" />
                  </AdminButton>
                  <AdminButton
                    variant="danger"
                    ariaLabel={`Delete ${p.title}`}
                    onClick={() => deletePortfolio(p.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </AdminButton>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Edit case study" : "New case study"}
      >
        {editing && (
          <PortfolioForm
            initial={editing.draft}
            onCancel={() => setEditing(null)}
            onSave={(draft) => {
              savePortfolio(draft, editing.id);
              setEditing(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
}

function toDraft(p: PortfolioItem): PortfolioDraft {
  const { id: _id, ...rest } = p;
  return rest;
}

function PortfolioForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: PortfolioDraft;
  onSave: (draft: PortfolioDraft) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(initial);
  const [error, setError] = useState("");
  const update = <K extends keyof PortfolioDraft>(k: K, v: PortfolioDraft[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!draft.title.trim()) return setError("Project title is required.");
        onSave(draft);
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Project title">
          <TextInput value={draft.title} onChange={(e) => update("title", e.target.value)} />
        </Field>
        <Field label="Client">
          <TextInput value={draft.client} onChange={(e) => update("client", e.target.value)} />
        </Field>
        <Field label="Category">
          <Select value={draft.category} onChange={(e) => update("category", e.target.value)}>
            {cats.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Year">
          <TextInput value={draft.year} onChange={(e) => update("year", e.target.value)} />
        </Field>
      </div>
      <Field label="Summary">
        <TextArea value={draft.blurb} onChange={(e) => update("blurb", e.target.value)} />
      </Field>
      <Field label="Live URL">
        <TextInput
          value={draft.liveUrl}
          placeholder="https://…"
          onChange={(e) => update("liveUrl", e.target.value)}
        />
      </Field>
      <Switch
        label="Published on site"
        checked={draft.status === "published"}
        onChange={(v) => update("status", v ? "published" : "draft")}
      />
      {error && (
        <p role="alert" className="rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <AdminButton variant="ghost" onClick={onCancel}>
          Cancel
        </AdminButton>
        <AdminButton variant="clay" type="submit">
          Save
        </AdminButton>
      </div>
    </form>
  );
}
