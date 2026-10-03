import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { DemoBadge, PageHeader, Panel } from "@/components/common";
import { DEMO_HISTORY } from "@/data/demo";
import { useAnalysis } from "@/hooks/useAnalysis";
import { formatConfidence } from "@/utils/diseaseMapping";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/history")({
  validateSearch: (s: Record<string, unknown>): { q?: string | undefined } => ({ q: typeof s["q"] === "string" ? s["q"] : undefined }),
  head: () => ({
    meta: [
      { title: "Detection History — AgroDisease AI" },
      { name: "description", content: "Previous crop disease analyses with search and filters." },
      { property: "og:title", content: "Detection History — AgroDisease AI" },
      { property: "og:description", content: "Browse and filter past leaf image analyses." },
    ],
  }),
  component: HistoryPage,
});

const selectCls = "h-10 rounded-lg border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring";

function HistoryPage() {
  const { q: initialQ } = Route.useSearch();
  const { history } = useAnalysis();
  const [q, setQ] = useState(initialQ ?? "");
  const [crop, setCrop] = useState("");
  const [disease, setDisease] = useState("");
  const [date, setDate] = useState("");

  const all = useMemo(() => [...history, ...DEMO_HISTORY], [history]);
  const crops = [...new Set(all.map((r) => r.crop))];
  const diseases = [...new Set(all.map((r) => r.disease))];
  const rows = all.filter(
    (r) =>
      (!q || `${r.crop} ${r.disease}`.toLowerCase().includes(q.toLowerCase())) &&
      (!crop || r.crop === crop) &&
      (!disease || r.disease === disease) &&
      (!date || r.date >= date),
  );

  return (
    <div>
      <PageHeader title="Detection History" description="Records marked Demo are sample entries until the real backend and database are connected." badge={<DemoBadge>Demo Records</DemoBadge>} />
      <Panel>
        <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className={cn(selectCls, "w-full pl-9")} />
          </div>
          <select value={crop} onChange={(e) => setCrop(e.target.value)} className={selectCls}>
            <option value="">All crops</option>
            {crops.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={disease} onChange={(e) => setDisease(e.target.value)} className={selectCls}>
            <option value="">All diseases</option>
            {diseases.map((d) => <option key={d}>{d}</option>)}
          </select>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={selectCls} aria-label="From date" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-3 pr-3">Date</th><th className="pr-3">Crop</th><th className="pr-3">Disease</th><th className="pr-3">Confidence</th><th className="pr-3">Recommendation</th><th>Source</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b last:border-0 hover:bg-leaf-soft">
                  <td className="py-3 pr-3 text-muted-foreground">{r.date}</td>
                  <td className="pr-3 font-semibold text-forest">{r.crop}</td>
                  <td className="pr-3">{r.disease}</td>
                  <td className="pr-3 font-semibold">{formatConfidence(r.confidence)}</td>
                  <td className="pr-3">
                    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold",
                      r.status === "Available" ? "bg-accent text-accent-foreground" : r.status === "Pending" ? "bg-warning-soft text-warning" : "bg-muted text-muted-foreground")}>
                      {r.status}
                    </span>
                  </td>
                  <td>{r.isDemo ? <DemoBadge>Demo</DemoBadge> : <span className="text-xs font-semibold text-success">Live</span>}</td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No records match your filters.</td></tr>}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
