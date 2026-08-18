import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Star, Trash2, Mail, Phone, MessageCircle, Search, RefreshCw } from "lucide-react";
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
} from "@/components/admin-ui";
import {
  useAdmin,
  statusLabels,
  setRequestStatus,
  toggleRequestStar,
  setRequestNote,
  deleteRequest,
  type ClientRequest,
  type RequestStatus,
} from "@/lib/admin-store";
import { fetchRequests, updateRequest } from "@/lib/firestore";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/requests")({
  head: () => ({
    meta: [
      { title: "Client Requests — SiteReadyPro Admin" },
      {
        name: "description",
        content: "Review project briefs from the contact wizard, update status, add notes and follow up with clients.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Client Requests — SiteReadyPro Admin" },
      { property: "og:description", content: "Project briefs inbox with status tracking and notes." },
    ],
  }),
  component: RequestsPage,
});

const statuses: RequestStatus[] = ["new", "in-review", "quoted", "won", "lost"];

function RequestsPage() {
  const { requests: localRequests } = useAdmin();
  const [firestoreRequests, setFirestoreRequests] = useState<ClientRequest[] | null>(null);
  const [loadingFirestore, setLoadingFirestore] = useState(false);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | RequestStatus | "starred">("all");
  const [openId, setOpenId] = useState<string | null>(null);

  // Merge Firestore requests (real) with local store requests (demo/old)
  // Firestore requests shown first if available
  const allRequests: ClientRequest[] = useMemo(() => {
    if (firestoreRequests) {
      // Map Firestore format to ClientRequest format
      return firestoreRequests.map((r) => ({
        ...r,
        status: (r as any).status ?? "new",
        starred: (r as any).starred ?? false,
        note: (r as any).note ?? "",
        channel: (r as any).preferred ?? (r as any).channel ?? "email",
        summary: (r as any).message ?? (r as any).summary ?? "",
        createdAt: (r as any).createdAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
      }));
    }
    return localRequests;
  }, [firestoreRequests, localRequests]);

  const loadFromFirestore = async () => {
    setLoadingFirestore(true);
    try {
      const data = await fetchRequests();
      setFirestoreRequests(data as unknown as ClientRequest[]);
    } catch {
      // Firestore not available — fall back to local requests
    } finally {
      setLoadingFirestore(false);
    }
  };

  // Auto-load Firestore requests on mount
  useEffect(() => { loadFromFirestore(); }, []);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return allRequests
      .filter((r) =>
        filter === "all" ? true : filter === "starred" ? r.starred : r.status === filter,
      )
      .filter((r) =>
        !needle
          ? true
          : [r.name, r.email, r.projectType, r.summary].join(" ").toLowerCase().includes(needle),
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [allRequests, q, filter]);

  const active = allRequests.find((r) => r.id === openId) ?? null;

  return (
    <div>
      <PageHead
        eyebrow="Inbox"
        title="Client requests."
        sub="All enquiries from the contact form — update status, add notes and follow up directly."
        action={
          <AdminButton variant="ghost" onClick={loadFromFirestore} disabled={loadingFirestore}>
            <RefreshCw className={cn("h-4 w-4", loadingFirestore && "animate-spin")} />
            {loadingFirestore ? "Loading…" : "Refresh from database"}
          </AdminButton>
        }
      />
      {firestoreRequests !== null && (
        <div className="mb-4 rounded-2xl border border-green-500/20 bg-green-500/5 px-4 py-3 text-xs text-green-700 dark:text-green-400">
          ✓ Showing {firestoreRequests.length} real request{firestoreRequests.length !== 1 ? "s" : ""} from Firestore database.
        </div>
      )}

      <Panel className="mb-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <TextInput
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, email, project…"
              className="pl-11"
              aria-label="Search requests"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {(["all", "starred", ...statuses] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-sm transition-colors",
                  filter === f
                    ? "bg-[var(--ink)] text-[var(--cream)]"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                )}
              >
                {f === "all" ? "All" : f === "starred" ? "Starred" : statusLabels[f]}
              </button>
            ))}
          </div>
        </div>
      </Panel>

      {shown.length === 0 ? (
        <EmptyState title="No requests found" sub="Try a different filter or search term." />
      ) : (
        <div className="space-y-3">
          {shown.map((r) => (
            <Panel key={r.id} className="p-4 sm:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleRequestStar(r.id)}
                      aria-label={r.starred ? "Unstar request" : "Star request"}
                      className="grid h-8 w-8 place-items-center rounded-full hover:bg-foreground/5"
                    >
                      <Star
                        className={cn(
                          "h-4 w-4",
                          r.starred ? "fill-[var(--clay)] text-[var(--clay)]" : "text-muted-foreground",
                        )}
                      />
                    </button>
                    <span className="font-editorial text-lg">{r.name}</span>
                    <Pill tone={r.status === "new" ? "clay" : r.status === "won" ? "ink" : "neutral"}>
                      {statusLabels[r.status]}
                    </Pill>
                    <Pill tone="muted">{new Date(r.createdAt).toLocaleDateString("en-IN")}</Pill>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{r.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
                    <span>{r.projectType}</span>
                    <span>{r.budget}</span>
                    <span>{r.timeline}</span>
                    <span>Prefers {r.channel}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Select
                    aria-label={`Status for ${r.name}`}
                    value={r.status}
                    onChange={(e) => setRequestStatus(r.id, e.target.value as RequestStatus)}
                    className="w-auto py-2"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {statusLabels[s]}
                      </option>
                    ))}
                  </Select>
                  <AdminButton variant="ghost" onClick={() => setOpenId(r.id)}>
                    Open
                  </AdminButton>
                  <AdminButton
                    variant="danger"
                    ariaLabel={`Delete request from ${r.name}`}
                    onClick={() => deleteRequest(r.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </AdminButton>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      )}

      <Modal open={!!active} onClose={() => setOpenId(null)} title={active?.name ?? "Request"}>
        {active && <RequestDetail req={active} />}
      </Modal>
    </div>
  );
}

function RequestDetail({ req }: { req: ClientRequest }) {
  const [note, setNote] = useState(req.note);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          ["Project type", req.projectType],
          ["Budget", req.budget],
          ["Timeline", req.timeline],
          ["Preferred channel", req.channel],
        ].map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-foreground/8 bg-background/50 p-4">
            <div className="eyebrow">{k}</div>
            <div className="mt-1 text-sm">{v}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-foreground/8 bg-background/50 p-4">
        <div className="eyebrow">Brief</div>
        <p className="mt-2 text-sm leading-relaxed">{req.summary}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <a
          href={`mailto:${req.email}`}
          className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-4 py-2 text-sm hover:bg-foreground/5"
        >
          <Mail className="h-4 w-4" /> {req.email}
        </a>
        <a
          href={`tel:${req.phone.replace(/\s/g, "")}`}
          className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-4 py-2 text-sm hover:bg-foreground/5"
        >
          <Phone className="h-4 w-4" /> {req.phone}
        </a>
        <a
          href={`https://wa.me/${req.phone.replace(/\D/g, "")}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-4 py-2 text-sm hover:bg-foreground/5"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
      </div>

      <Field label="Internal note">
        <TextArea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Quote sent, call scheduled, client requirements…"
        />
      </Field>
      <AdminButton variant="clay" onClick={() => setRequestNote(req.id, note)}>
        Save note
      </AdminButton>
    </div>
  );
}
