import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  Plus, Pencil, Trash2, Star, Search, Upload, Link as LinkIcon,
  Code2, Globe, Server, Zap, X, Check, ExternalLink,
} from "lucide-react";
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
import { uploadTemplateImage, uploadTemplateZip } from "@/lib/firestore";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/templates")({
  head: () => ({
    meta: [
      { title: "Template Library — SiteReadyPro Admin" },
      { name: "description", content: "Upload and manage free and premium website templates." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: TemplatesAdmin,
});

const categories = ["Portfolio", "Restaurant", "E-commerce", "Agency", "Café", "SaaS", "Other"];

const ALL_TECH = [
  "HTML5", "CSS3", "Vanilla JS", "Alpine.js", "GSAP", "AOS",
  "React", "Vue", "Angular", "Next.js",
  "Firebase", "Supabase", "MongoDB", "Node.js", "Laravel",
  "Bootstrap", "Tailwind CSS",
];

/* ─── Template card ─── */
function TemplateCard({
  t,
  onEdit,
  onDelete,
}: {
  t: AdminTemplate;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Panel className="flex flex-col p-4">
      {/* Preview image */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-foreground/5">
        {t.image ? (
          <img src={t.image} alt={t.title} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center text-xs text-muted-foreground">No preview image</div>
        )}
        {/* Badges on image */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <Pill tone={t.type === "premium" ? "ink" : "butter"}>
            {t.type === "premium" ? "Premium" : "Free"}
          </Pill>
          {t.featured && <Pill tone="clay">Featured</Pill>}
          <Pill tone={t.siteType === "dynamic" ? "neutral" : "neutral"}>
            {t.siteType === "static" ? "Static" : "Dynamic"}
          </Pill>
        </div>
        {/* Live preview link */}
        {t.previewUrl && (
          <a
            href={t.previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open live preview"
            className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      {/* Info */}
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

        {/* Tech stack chips */}
        {t.techStack?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {t.techStack.slice(0, 4).map((tech) => (
              <span key={tech} className="rounded-full bg-foreground/8 px-2 py-0.5 text-[10px] text-muted-foreground">
                {tech}
              </span>
            ))}
            {t.techStack.length > 4 && (
              <span className="rounded-full bg-foreground/8 px-2 py-0.5 text-[10px] text-muted-foreground">
                +{t.techStack.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Backend */}
        {t.backendUsed && t.backendUsed !== "None" && (
          <div className="mt-1.5 flex items-center gap-1 text-[10px] text-muted-foreground">
            <Server className="h-3 w-3" /> Backend: {t.backendUsed}
          </div>
        )}

        {/* ZIP status */}
        <div className="mt-2 flex items-center gap-1 text-[10px]">
          {t.zipUrl ? (
            <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
              <Check className="h-3 w-3" /> ZIP uploaded
            </span>
          ) : (
            <span className="text-muted-foreground flex items-center gap-1">
              <Upload className="h-3 w-3" /> No ZIP yet
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
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
          <AdminButton variant="ghost" ariaLabel={`Edit ${t.title}`} onClick={onEdit}>
            <Pencil className="h-4 w-4" />
          </AdminButton>
          <AdminButton variant="danger" ariaLabel={`Delete ${t.title}`} onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </AdminButton>
        </div>
      </div>
    </Panel>
  );
}

/* ─── Main page ─── */
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
        sub="Upload free and premium templates — set tech stack, preview URL, ZIP file, price and publish status."
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
              placeholder="Search by name, category, slug…"
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
        <EmptyState
          title="No templates yet"
          sub="Click 'New template' to upload your first one."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((t) => (
            <TemplateCard
              key={t.id}
              t={t}
              onEdit={() => setEditing({ id: t.id, draft: toDraft(t) })}
              onDelete={() => deleteTemplate(t.id)}
            />
          ))}
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Edit template" : "Upload new template"}
      >
        {editing && (
          <TemplateForm
            initial={editing.draft}
            editingId={editing.id}
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

/* ─── Template upload/edit form ─── */
function TemplateForm({
  initial,
  editingId,
  onSave,
  onCancel,
}: {
  initial: TemplateDraft;
  editingId?: string;
  onSave: (draft: TemplateDraft) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<TemplateDraft>(initial);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState<"image" | "zip" | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);

  const update = <K extends keyof TemplateDraft>(k: K, v: TemplateDraft[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  const toggleTech = (tech: string) => {
    setDraft((d) => ({
      ...d,
      techStack: d.techStack.includes(tech)
        ? d.techStack.filter((t) => t !== tech)
        : [...d.techStack, tech],
    }));
  };

  const handleImageUpload = async (file: File) => {
    if (!draft.slug && !draft.title) {
      setError("Please enter a title or slug before uploading an image.");
      return;
    }
    const slug = draft.slug || draft.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    setUploading("image");
    try {
      const url = await uploadTemplateImage(file, slug);
      update("image", url);
    } catch (err) {
      setError("Image upload failed. Make sure Firebase Storage is enabled.");
    } finally {
      setUploading(null);
    }
  };

  const handleZipUpload = async (file: File) => {
    if (!draft.slug && !draft.title) {
      setError("Please enter a title or slug before uploading a ZIP.");
      return;
    }
    const slug = draft.slug || draft.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    setUploading("zip");
    try {
      const { path, url } = await uploadTemplateZip(file, slug);
      setDraft((d) => ({ ...d, zipStoragePath: path, zipUrl: url }));
    } catch (err) {
      setError("ZIP upload failed. Make sure Firebase Storage is enabled.");
    } finally {
      setUploading(null);
    }
  };

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (!draft.title.trim()) return setError("Title is required.");
        if (draft.techStack.length === 0) return setError("Select at least one tech stack.");
        const slug =
          draft.slug.trim() ||
          draft.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        onSave({ ...draft, slug, price: draft.type === "free" ? 0 : draft.price });
      }}
    >
      {/* Basic info */}
      <div className="rounded-2xl border border-foreground/8 bg-foreground/3 p-4">
        <p className="eyebrow mb-4">Basic Info</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Template Title *">
            <TextInput
              value={draft.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. Aurora Portfolio"
            />
          </Field>
          <Field label="Slug" hint="Auto-generated from title if blank">
            <TextInput
              value={draft.slug}
              onChange={(e) => update("slug", e.target.value)}
              placeholder="aurora-portfolio"
            />
          </Field>
          <Field label="Category">
            <Select value={draft.category} onChange={(e) => update("category", e.target.value)}>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </Field>
          <Field label="Type">
            <Select
              value={draft.type}
              onChange={(e) => update("type", e.target.value as TemplateDraft["type"])}
            >
              <option value="free">Free — no payment needed</option>
              <option value="premium">Premium — paid download</option>
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
        </div>
        <div className="mt-4">
          <Field label="Short tagline (1 line)">
            <TextInput
              value={draft.tagline}
              onChange={(e) => update("tagline", e.target.value)}
              placeholder="A minimal portfolio for designers and developers."
            />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Full description">
            <TextArea
              value={draft.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Describe what this template includes, who it's for, and what makes it special…"
            />
          </Field>
        </div>
      </div>

      {/* Tech stack */}
      <div className="rounded-2xl border border-foreground/8 bg-foreground/3 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Code2 className="h-4 w-4 text-muted-foreground" />
          <p className="eyebrow">Tech Stack *</p>
          <span className="text-xs text-muted-foreground">(select all that apply)</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {ALL_TECH.map((tech) => {
            const selected = draft.techStack.includes(tech);
            return (
              <button
                key={tech}
                type="button"
                onClick={() => toggleTech(tech)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                  selected
                    ? "bg-[var(--ink)] text-[var(--cream)]"
                    : "border border-foreground/15 text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                )}
              >
                {selected && <Check className="mr-1 inline h-3 w-3" />}
                {tech}
              </button>
            );
          })}
        </div>

        {/* Site type */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="Site type">
            <Select
              value={draft.siteType}
              onChange={(e) => update("siteType", e.target.value as TemplateDraft["siteType"])}
            >
              <option value="static">Static — HTML/CSS/JS only</option>
              <option value="dynamic">Dynamic — uses a backend/database</option>
            </Select>
          </Field>
          <Field label="Backend used">
            <Select
              value={draft.backendUsed}
              onChange={(e) => update("backendUsed", e.target.value as TemplateDraft["backendUsed"])}
            >
              <option value="None">None</option>
              <option value="Firebase">Firebase</option>
              <option value="Supabase">Supabase</option>
              <option value="MongoDB">MongoDB</option>
              <option value="Node.js">Node.js</option>
              <option value="Custom">Custom</option>
            </Select>
          </Field>
        </div>
      </div>

      {/* Preview image upload */}
      <div className="rounded-2xl border border-foreground/8 bg-foreground/3 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <p className="eyebrow">Preview Image</p>
        </div>
        {draft.image ? (
          <div className="relative">
            <img src={draft.image} alt="Preview" className="h-40 w-full rounded-xl object-cover" />
            <button
              type="button"
              onClick={() => update("image", "")}
              className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            disabled={!!uploading}
            className="flex h-32 w-full items-center justify-center gap-3 rounded-xl border-2 border-dashed border-foreground/15 text-sm text-muted-foreground hover:border-foreground/30 hover:text-foreground disabled:opacity-50"
          >
            {uploading === "image" ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
            ) : (
              <Upload className="h-5 w-5" />
            )}
            {uploading === "image" ? "Uploading…" : "Click to upload preview image (JPG/PNG, max 5MB)"}
          </button>
        )}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleImageUpload(f);
            e.target.value = "";
          }}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Or paste an image URL directly:
        </p>
        <TextInput
          value={draft.image}
          onChange={(e) => update("image", e.target.value)}
          placeholder="https://…"
          className="mt-1"
        />
      </div>

      {/* Live preview URL */}
      <div className="rounded-2xl border border-foreground/8 bg-foreground/3 p-4">
        <div className="flex items-center gap-2 mb-3">
          <LinkIcon className="h-4 w-4 text-muted-foreground" />
          <p className="eyebrow">Live Preview URL</p>
          <span className="text-xs text-muted-foreground">(optional)</span>
        </div>
        <TextInput
          value={draft.previewUrl}
          onChange={(e) => update("previewUrl", e.target.value)}
          placeholder="https://aurora-portfolio.netlify.app"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Deploy the template to Netlify/Vercel/GitHub Pages and paste the URL here. Visitors can click "Live Preview" to see it in a fullscreen iframe.
        </p>
      </div>

      {/* ZIP upload */}
      <div className="rounded-2xl border border-foreground/8 bg-foreground/3 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Server className="h-4 w-4 text-muted-foreground" />
          <p className="eyebrow">Template ZIP File</p>
        </div>
        {draft.zipUrl ? (
          <div className="flex items-center gap-3 rounded-xl border border-foreground/10 bg-foreground/5 px-4 py-3">
            <Check className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm">ZIP file uploaded to Firebase Storage</div>
              <div className="text-xs text-muted-foreground">{draft.zipStoragePath}</div>
            </div>
            <button
              type="button"
              onClick={() => setDraft((d) => ({ ...d, zipUrl: "", zipStoragePath: "" }))}
              className="shrink-0 text-xs text-muted-foreground hover:text-red-500"
            >
              Remove
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => zipInputRef.current?.click()}
            disabled={!!uploading}
            className="flex h-32 w-full items-center justify-center gap-3 rounded-xl border-2 border-dashed border-foreground/15 text-sm text-muted-foreground hover:border-foreground/30 hover:text-foreground disabled:opacity-50"
          >
            {uploading === "zip" ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
            ) : (
              <Upload className="h-5 w-5" />
            )}
            {uploading === "zip" ? "Uploading to Firebase Storage…" : "Click to upload template ZIP (max 50MB)"}
          </button>
        )}
        <input
          ref={zipInputRef}
          type="file"
          accept=".zip"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleZipUpload(f);
            e.target.value = "";
          }}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          ZIP should contain: index.html, /css, /js, /images folders and a README.md setup guide. The file is stored securely in Firebase Storage — visitors never get a direct link unless you grant it.
        </p>
      </div>

      {/* Publish settings */}
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
        <AdminButton variant="ghost" onClick={onCancel}>Cancel</AdminButton>
        <AdminButton variant="clay" type="submit" disabled={!!uploading}>
          {uploading ? "Uploading…" : "Save template"}
        </AdminButton>
      </div>
    </form>
  );
}
