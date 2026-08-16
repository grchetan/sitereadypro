import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RotateCcw, Check } from "lucide-react";
import {
  AdminButton,
  Field,
  PageHead,
  Panel,
  Switch,
  TextArea,
  TextInput,
} from "@/components/admin-ui";
import { useAdmin, saveSettings, resetDemoData, type AdminSettings } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "Settings — SiteReadyPro Admin" },
      {
        name: "description",
        content: "Update brand details, contact channels, plan pricing and the free domain / maintenance perks shown on the site.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Settings — SiteReadyPro Admin" },
      { property: "og:description", content: "Brand, pricing and site-wide perk settings." },
    ],
  }),
  component: SettingsAdmin,
});

function SettingsAdmin() {
  const { settings } = useAdmin();
  const [form, setForm] = useState<AdminSettings>(settings);
  const [saved, setSaved] = useState(false);
  const update = <K extends keyof AdminSettings>(k: K, v: AdminSettings[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      <PageHead
        eyebrow="Configuration"
        title="Settings."
        sub="Brand, contact, pricing and perks — everything the site shows is edited from here."
      />

      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          saveSettings(form);
          setSaved(true);
          window.setTimeout(() => setSaved(false), 2500);
        }}
      >
        <Panel>
          <h2 className="mb-4 font-editorial text-xl">Brand & contact</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Brand name">
              <TextInput value={form.brandName} onChange={(e) => update("brandName", e.target.value)} />
            </Field>
            <Field label="Contact email">
              <TextInput
                type="email"
                value={form.contactEmail}
                onChange={(e) => update("contactEmail", e.target.value)}
              />
            </Field>
            <Field label="WhatsApp number">
              <TextInput value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Site announcement" hint="Short line for banners and hero badges">
              <TextArea
                value={form.announcement}
                onChange={(e) => update("announcement", e.target.value)}
              />
            </Field>
          </div>
        </Panel>

        <Panel>
          <h2 className="mb-4 font-editorial text-xl">Plan pricing (₹)</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Starter">
              <TextInput
                type="number"
                min={0}
                value={form.starterPrice}
                onChange={(e) => update("starterPrice", Number(e.target.value) || 0)}
              />
            </Field>
            <Field label="Pro">
              <TextInput
                type="number"
                min={0}
                value={form.proPrice}
                onChange={(e) => update("proPrice", Number(e.target.value) || 0)}
              />
            </Field>
            <Field label="Studio">
              <TextInput
                type="number"
                min={0}
                value={form.studioPrice}
                onChange={(e) => update("studioPrice", Number(e.target.value) || 0)}
              />
            </Field>
          </div>
        </Panel>

        <Panel>
          <h2 className="mb-4 font-editorial text-xl">Perks & availability</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Switch
              label="Free .com domain (first year)"
              checked={form.freeDomain}
              onChange={(v) => update("freeDomain", v)}
            />
            <Switch
              label="Free maintenance included"
              checked={form.freeMaintenance}
              onChange={(v) => update("freeMaintenance", v)}
            />
            <Switch
              label="Accepting new projects"
              checked={form.acceptingProjects}
              onChange={(v) => update("acceptingProjects", v)}
            />
          </div>
        </Panel>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <AdminButton
            variant="ghost"
            onClick={() => {
              resetDemoData();
              setForm(settings);
            }}
          >
            <RotateCcw className="h-4 w-4" /> Reset demo data
          </AdminButton>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-sm text-[var(--clay)]" role="status">
                <Check className="h-4 w-4" /> Saved
              </span>
            )}
            <AdminButton variant="clay" type="submit">
              Save settings
            </AdminButton>
          </div>
        </div>
      </form>
    </div>
  );
}
