import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Star, Eye, EyeOff } from "lucide-react";
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
import { ServiceIcon } from "@/components/service-icon";
import {
  useAdmin,
  emptyService,
  saveService,
  deleteService,
  toggleServiceStatus,
  toggleServicePopular,
  moveService,
  serviceIconLabels,
  type ServiceDraft,
  type AdminService,
} from "@/lib/admin-store";

export const Route = createFileRoute("/admin/services")({
  head: () => ({
    meta: [
      { title: "Services & Plans — SiteReadyPro Admin" },
      {
        name: "description",
        content:
          "Create, price and publish the freelance service plans that appear on the SiteReadyPro website.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Services & Plans — SiteReadyPro Admin" },
      { property: "og:description", content: "Manage service plans, pricing and deliverables." },
    ],
  }),
  component: AdminServices,
});

function AdminServices() {
  const { services } = useAdmin();
  const list = [...services].sort((a, b) => a.order - b.order);

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | undefined>();
  const [draft, setDraft] = useState<ServiceDraft>(emptyService());
  const [features, setFeatures] = useState("");

  const startNew = () => {
    setEditId(undefined);
    setDraft(emptyService(list.length + 1));
    setFeatures("");
    setOpen(true);
  };

  const startEdit = (s: AdminService) => {
    const { id: _id, ...rest } = s;
    setEditId(s.id);
    setDraft(rest);
    setFeatures(s.deliverables.join("\n"));
    setOpen(true);
  };

  const submit = () => {
    if (!draft.name.trim()) return;
    saveService(
      {
        ...draft,
        deliverables: features
          .split("\n")
          .map((f) => f.trim())
          .filter(Boolean),
      },
      editId,
    );
    setOpen(false);
  };

  return (
    <div>
      <PageHead
        eyebrow="Services & plans"
        title="Manage every service you offer."
        sub="This list feeds the Services page, the home page and pricing. Change a price, timeline or deliverable and the site updates instantly."
        action={
          <AdminButton variant="clay" onClick={startNew}>
            <Plus className="h-4 w-4" /> New service
          </AdminButton>
        }
      />

      {list.length === 0 ? (
        <EmptyState title="No services yet" sub="Add your first plan — Static, Dynamic or E-commerce." />
      ) : (
        <div className="space-y-4">
          {list.map((s, i) => (
            <Panel key={s.id}>
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--ink)] text-[var(--cream)]">
                      <ServiceIcon name={s.icon} className="h-4 w-4" />
                    </span>
                    <h2 className="font-editorial text-xl">{s.name}</h2>
                    <Pill tone={s.status === "published" ? "clay" : "muted"}>
                      {s.status === "published" ? "Live" : "Draft"}
                    </Pill>
                    {s.popular && <Pill tone="butter">Most popular</Pill>}
                  </div>
                  <p className="mt-3 max-w-xl text-sm text-muted-foreground">{s.tagline}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                    <span>
                      <span className="font-editorial text-2xl text-[var(--clay)]">
                        ₹{s.price.toLocaleString("en-IN")}
                      </span>
                      {s.comparePrice > 0 && (
                        <span className="ml-2 text-xs text-muted-foreground line-through">
                          ₹{s.comparePrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </span>
                    <span className="text-muted-foreground">~{s.timeline}</span>
                    {s.bestFor && <span className="text-muted-foreground">For: {s.bestFor}</span>}
                    <span className="text-muted-foreground">{s.deliverables.length} deliverables</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <AdminButton variant="ghost" onClick={() => moveService(s.id, -1)} disabled={i === 0} ariaLabel={`Move ${s.name} up`}>
                    <ArrowUp className="h-4 w-4" />
                  </AdminButton>
                  <AdminButton
                    variant="ghost"
                    onClick={() => moveService(s.id, 1)}
                    disabled={i === list.length - 1}
                    ariaLabel={`Move ${s.name} down`}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </AdminButton>
                  <AdminButton variant="ghost" onClick={() => toggleServicePopular(s.id)} ariaLabel={`Mark ${s.name} popular`}>
                    <Star className={s.popular ? "h-4 w-4 fill-[var(--clay)] text-[var(--clay)]" : "h-4 w-4"} />
                  </AdminButton>
                  <AdminButton variant="ghost" onClick={() => toggleServiceStatus(s.id)}>
                    {s.status === "published" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {s.status === "published" ? "Unpublish" : "Publish"}
                  </AdminButton>
                  <AdminButton variant="ink" onClick={() => startEdit(s)}>
                    <Pencil className="h-4 w-4" /> Edit
                  </AdminButton>
                  <AdminButton variant="danger" onClick={() => deleteService(s.id)} ariaLabel={`Delete ${s.name}`}>
                    <Trash2 className="h-4 w-4" />
                  </AdminButton>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editId ? "Edit service" : "New service"}>
        <div className="space-y-4">
          <Field label="Service name">
            <TextInput
              value={draft.name}
              placeholder="Business Dynamic Site"
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
          </Field>
          <Field label="One-line tagline">
            <TextInput
              value={draft.tagline}
              placeholder="CMS-powered site you can update yourself."
              onChange={(e) => setDraft({ ...draft, tagline: e.target.value })}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Starting price (₹)">
              <TextInput
                type="number"
                min={0}
                value={draft.price}
                onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) || 0 })}
              />
            </Field>
            <Field label="Compare-at price (₹)" hint="0 = hide the struck-through price">
              <TextInput
                type="number"
                min={0}
                value={draft.comparePrice}
                onChange={(e) => setDraft({ ...draft, comparePrice: Number(e.target.value) || 0 })}
              />
            </Field>
            <Field label="Delivery timeline">
              <TextInput
                value={draft.timeline}
                placeholder="10 days"
                onChange={(e) => setDraft({ ...draft, timeline: e.target.value })}
              />
            </Field>
            <Field label="Best for">
              <TextInput
                value={draft.bestFor}
                placeholder="Cafés, clinics, studios"
                onChange={(e) => setDraft({ ...draft, bestFor: e.target.value })}
              />
            </Field>
            <Field label="Icon">
              <Select
                value={draft.icon}
                onChange={(e) => setDraft({ ...draft, icon: e.target.value as ServiceDraft["icon"] })}
              >
                {Object.entries(serviceIconLabels).map(([k, label]) => (
                  <option key={k} value={k}>
                    {label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Card colour band">
              <Select
                value={draft.band}
                onChange={(e) => setDraft({ ...draft, band: e.target.value as ServiceDraft["band"] })}
              >
                <option value="band-blush">Blush</option>
                <option value="band-sage">Sage</option>
                <option value="band-butter">Butter</option>
                <option value="band-cream">Cream</option>
              </Select>
            </Field>
          </div>
          <Field label="Deliverables" hint="Ek line = ek point">
            <TextArea
              value={features}
              rows={7}
              placeholder={"Custom admin dashboard\nFree .com domain\nFree maintenance"}
              onChange={(e) => setFeatures(e.target.value)}
            />
          </Field>
          <Switch
            checked={draft.status === "published"}
            onChange={(v) => setDraft({ ...draft, status: v ? "published" : "draft" })}
            label="Published on website"
          />
          <Switch
            checked={draft.popular}
            onChange={(v) => setDraft({ ...draft, popular: v })}
            label="Highlight as most popular"
          />
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <AdminButton variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="clay" onClick={submit} disabled={!draft.name.trim()}>
              {editId ? "Save changes" : "Create service"}
            </AdminButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
