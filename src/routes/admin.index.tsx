import { createFileRoute, Link } from "@tanstack/react-router";
import { Inbox, LayoutTemplate, FolderKanban, IndianRupee, Star, ArrowUpRight } from "lucide-react";
import { PageHead, Panel, Pill } from "@/components/admin-ui";
import { useAdmin, statusLabels } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — SiteReadyPro" },
      {
        name: "description",
        content: "Overview of client requests, template library and portfolio activity for SiteReadyPro.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Admin Dashboard — SiteReadyPro" },
      { property: "og:description", content: "Requests, templates and portfolio at a glance." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { requests, templates, portfolio, settings } = useAdmin();

  const newReq = requests.filter((r) => r.status === "new").length;
  const premium = templates.filter((t) => t.type === "premium").length;
  const published = templates.filter((t) => t.status === "published").length;
  const won = requests.filter((r) => r.status === "won").length;

  const stats = [
    { label: "New requests", value: newReq, sub: `${requests.length} total`, icon: Inbox },
    { label: "Templates live", value: published, sub: `${premium} premium`, icon: LayoutTemplate },
    { label: "Case studies", value: portfolio.length, sub: `${portfolio.filter((p) => p.status === "published").length} published`, icon: FolderKanban },
    { label: "Projects won", value: won, sub: "all time", icon: IndianRupee },
  ];

  const recent = [...requests].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4);

  return (
    <div>
      <PageHead
        eyebrow="Overview"
        title="Aaj ka control room."
        sub={`Everything for ${settings.brandName} in one place — requests, templates, portfolio and pricing.`}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Panel key={s.label} className="p-5">
            <div className="flex items-start justify-between">
              <div className="eyebrow">{s.label}</div>
              <s.icon className="h-4 w-4 text-[var(--clay)]" />
            </div>
            <div className="mt-3 font-editorial text-[2.5rem] leading-none">{s.value}</div>
            <div className="mt-1.5 text-xs text-muted-foreground">{s.sub}</div>
          </Panel>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Panel>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-editorial text-xl">Latest client requests</h2>
            <Link to="/admin/requests" className="inline-flex items-center gap-1 text-sm text-[var(--clay)]">
              All <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <ul className="space-y-3">
            {recent.map((r) => (
              <li
                key={r.id}
                className="flex flex-col gap-2 rounded-2xl border border-foreground/8 bg-background/50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium">{r.name}</span>
                    {r.starred && <Star className="h-3.5 w-3.5 fill-[var(--clay)] text-[var(--clay)]" />}
                  </div>
                  <div className="mt-0.5 truncate text-xs text-muted-foreground">
                    {r.projectType} · {r.budget}
                  </div>
                </div>
                <Pill tone={r.status === "new" ? "clay" : r.status === "won" ? "ink" : "neutral"}>
                  {statusLabels[r.status]}
                </Pill>
              </li>
            ))}
          </ul>
        </Panel>

        <div className="space-y-6">
          <Panel>
            <h2 className="mb-4 font-editorial text-xl">Template mix</h2>
            <div className="space-y-3">
              {["free", "premium"].map((type) => {
                const count = templates.filter((t) => t.type === type).length;
                const pct = templates.length ? Math.round((count / templates.length) * 100) : 0;
                return (
                  <div key={type}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize">{type}</span>
                      <span className="text-muted-foreground">{count}</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-foreground/8">
                      <div
                        className="h-full rounded-full bg-[var(--clay)]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <Link
              to="/admin/templates"
              className="mt-5 inline-flex items-center gap-1 text-sm text-[var(--clay)]"
            >
              Manage templates <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Panel>

          <Panel>
            <h2 className="mb-3 font-editorial text-xl">Site status</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Accepting projects</span>
                <Pill tone={settings.acceptingProjects ? "clay" : "muted"}>
                  {settings.acceptingProjects ? "Open" : "Paused"}
                </Pill>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Free .com domain</span>
                <Pill tone={settings.freeDomain ? "butter" : "muted"}>
                  {settings.freeDomain ? "On" : "Off"}
                </Pill>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Free maintenance</span>
                <Pill tone={settings.freeMaintenance ? "butter" : "muted"}>
                  {settings.freeMaintenance ? "On" : "Off"}
                </Pill>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
