import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Star, Search } from "lucide-react";
import {
  AdminButton,
  EmptyState,
  Field,
  Modal,
  PageHead,
  Panel,
  Pill,
  Select,
  TextArea,
  TextInput,
  Switch,
} from "@/components/admin-ui";
import {
  useAdmin,
  saveTemplate,
  deleteTemplate,
  toggleTemplateStatus,
  toggleTemplateFeatured,
  emptyTemplate,
  type AdminTemplate,
  type TemplateDraft,
} from "@/lib/admin-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/templates")({
  head: () => ({
    meta: [
      { title: "Template Library — SiteReadyPro Admin" },
      {
        name: "description",
        content: "Add, edit and publish website templates — set free or premium type, price, category and featured status.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Template Library — SiteReadyPro Admin" },
      { property: "og:description", content: "Manage free and premium website templates." },
    ],
  }),
  component: TemplatesAdmin,
});

const categories = ["Portfolio", "Restaurant", "E-commerce", "Agency", "Café", "SaaS", "Other"];

function TemplatesAdmin() {
  const { templates } = useAdmin();
  const [q, setQ] = useState("");
  const [type, setType] = useState<"all" | "free" | "premium">("all");
  const [editing, setEditing] = useState<{ id?: string; draft: TemplateDraft } | null>(null);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return templates
      .filter((t) => (type === "all" ? true : t.type === type))
      .filter((t) => (!needle ? true : `${t.title} ${t.category} ${t.slug}`.toLowerCase().includes(needle)));
  }, [templates, q, type]);

  return (
    <div>
      <PageHead
        eyebrow="Library"
        title="Templates."
        sub="Free and Premium kept separate — control price, category, featured and publish status here."
        action={
          <AdminButton variant="clay" onClick={() => setEditing({ draft: emptyTemplate() })}>
            <Plus className="h-4 w-4" /> New template
          </AdminButton>
        }
      />

      <Panel className="mb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <TextInput
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search templates…"
              className="pl-11"
              aria-label="Search templates"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "free", "premium"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm capitalize transition-colors",
                  type === t
                    ? "bg-[var(--ink)] text-[var(--cream)]"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </Panel>

      {shown.length === 0 ? (
        <EmptyState title="No templates" sub="Add a new template or reset the filters." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((t) => (
            <Panel key={t.id} className="flex flex-col p-4">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-foreground/5">
                {t.image ? (
                  <img src={t.image} alt={t.title} loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center text-xs text-muted-foreground">
                    No preview
                  </div>
                )}
                <div className="absolute left-3 top-3 flex gap-2">
                  <Pill tone={t.type === "premium" ? "ink" : "butter"}>
                    {t.type === "premium" ? "Premium" : "Free"}
                  </Pill>
                  {t.featured && <Pill tone="clay">Featured</Pill>}
                </div>
              </div>

              <div className="mt-4 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate font-editorial text-lg">{t.title || "Untitled"}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {t.category} · /{t.slug || "—"}
                    </div>
                  </div>
                  <div className="shrink-0 text-sm font-medium">
                    {t.price === 0 ? "Free" : `₹${t.price.toLocaleString("en-IN")}`}
                  </div>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{t.tagline}</p>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-foreground/8 pt-4">
                <button
                  type="button"
                  onClick={() => toggleTemplateStatus(t.id)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium",
                    t.status === "published"
                      ? "bg-[var(--clay)]/15 text-[var(--clay)]"
                      : "bg-foreground/8 text-muted-foreground",
                  )}
                >
                  {t.status === "published" ? "Published" : "Draft"}
                </button>
                <button
                  type="button"
                  onClick={() => toggleTemplateFeatured(t.id)}
                  aria-label="Toggle featured"
                  className="grid h-9 w-9 place-items-center rounded-full border border-foreground/12 hover:bg-foreground/5"
                >
                  <Star className={cn("h-4 w-4", t.featured && "fill-[var(--clay)] text-[var(--clay)]")} />
                </button>
                <div className="ml-auto flex gap-2">
                  <AdminButton
                    variant="ghost"
                    ariaLabel={`Edit ${t.title}`}
                    onClick={() => setEditing({ id: t.id, draft: toDraft(t) })}
                  >
                    <Pencil className="h-4 w-4" />
                  </AdminButton>
                  <AdminButton
                    variant="danger"
                    ariaLabel={`Delete ${t.title}`}
                    onClick={() => deleteTemplate(t.id)}
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
        title={editing?.id ? "Edit template" : "New template"}
      >
        {editing && (
          <TemplateForm
            initial={editing.draft}
            onCancel={() => setEditing(null)}
            onSave={(draft) => {
              saveTemplate(draft, editing.id);
              setEditing(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
}

function toDraft(t: AdminTemplate): TemplateDraft {
  const { id: _id, updatedAt: _u, ...rest } = t;
  return rest;
}

function TemplateForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: TemplateDraft;
  onSave: (draft: TemplateDraft) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<TemplateDraft>(initial);
  const [error, setError] = useState("");
  const update = <K extends keyof TemplateDraft>(k: K, v: TemplateDraft[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!draft.title.trim()) return setError("Title is required.");
        const slug =
          draft.slug.trim() ||
          draft.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        onSave({ ...draft, slug, price: draft.type === "free" ? 0 : draft.price });
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title">
          <TextInput value={draft.title} onChange={(e) => update("title", e.target.value)} />
        </Field>
        <Field label="Slug" hint="Blank chhodo to title se ban jayega">
          <TextInput value={draft.slug} onChange={(e) => update("slug", e.target.value)} />
        </Field>
        <Field label="Category">
          <Select value={draft.category} onChange={(e) => update("category", e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Type">
          <Select
            value={draft.type}
            onChange={(e) => update("type", e.target.value as TemplateDraft["type"])}
          >
            <option value="free">Free</option>
            <option value="premium">Premium</option>
          </Select>
        </Field>
        {draft.type === "premium" && (
          <Field label="Price (₹)">
            <TextInput
              type="number"
              min={0}
              value={draft.price}
              onChange={(e) => update("price", Number(e.target.value) || 0)}
            />
          </Field>
        )}
        <Field label="Preview image URL">
          <TextInput
            value={draft.image}
            placeholder="https://…"
            onChange={(e) => update("image", e.target.value)}
          />
        </Field>
      </div>

      <Field label="Tagline">
        <TextArea value={draft.tagline} onChange={(e) => update("tagline", e.target.value)} />
      </Field>

      <div className="grid gap-3 sm:grid-cols-2">
        <Switch
          label="Published on site"
          checked={draft.status === "published"}
          onChange={(v) => update("status", v ? "published" : "draft")}
        />
        <Switch
          label="Featured on homepage"
          checked={draft.featured}
          onChange={(v) => update("featured", v)}
        />
      </div>

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
          Save template
        </AdminButton>
      </div>
    </form>
  );
}
