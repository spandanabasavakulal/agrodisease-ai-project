import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { DemoBadge, PageHeader, Panel } from "@/components/common";
import { DEMO_ANALYTICS } from "@/data/demo";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — AgroDisease AI" },
      { name: "description", content: "Disease, crop and confidence distribution charts (demo data until the model is connected)." },
      { property: "og:title", content: "Analytics — AgroDisease AI" },
      { property: "og:description", content: "Crop disease detection analytics dashboard." },
    ],
  }),
  component: AnalyticsPage,
});

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
const tip = { contentStyle: { borderRadius: 12, border: "1px solid var(--border)", fontSize: 12 } };

function ChartBox({ title, children, className }: { title: string; children: React.ReactElement; className?: string | undefined }) {
  return (
    <Panel title={title} className={className}>
      <div className="h-64"><ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer></div>
    </Panel>
  );
}

function AnalyticsPage() {
  const d = DEMO_ANALYTICS;
  return (
    <div>
      <PageHeader title="Analytics" description="These charts illustrate the dashboard layout. Values are not actual project results." badge={<DemoBadge>Demo Analytics — Awaiting Real Model Data</DemoBadge>} />
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartBox title="Disease Detection Distribution">
          <BarChart data={d.diseases}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip {...tip} /><Bar dataKey="value" radius={[6, 6, 0, 0]} fill="var(--chart-1)" /></BarChart>
        </ChartBox>
        <ChartBox title="Crop Distribution">
          <PieChart><Pie data={d.crops} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>{d.crops.map((_, i) => <Cell key={i} fill={COLORS[i % 5]} />)}</Pie><Tooltip {...tip} /><Legend /></PieChart>
        </ChartBox>
        <ChartBox title="Healthy vs Diseased Leaves">
          <PieChart><Pie data={d.health} dataKey="value" nameKey="name" outerRadius={90}><Cell fill="var(--chart-5)" /><Cell fill="var(--chart-2)" /></Pie><Tooltip {...tip} /><Legend /></PieChart>
        </ChartBox>
        <ChartBox title="Prediction Confidence Distribution">
          <BarChart data={d.confidence}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="range" fontSize={11} /><YAxis fontSize={11} /><Tooltip {...tip} /><Bar dataKey="count" radius={[6, 6, 0, 0]} fill="var(--chart-2)" /></BarChart>
        </ChartBox>
        <ChartBox title="Monthly Detection Count" className="lg:col-span-2">
          <LineChart data={d.monthly}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="month" fontSize={11} /><YAxis fontSize={11} /><Tooltip {...tip} /><Line type="monotone" dataKey="count" stroke="var(--chart-1)" strokeWidth={3} dot={{ r: 4 }} /></LineChart>
        </ChartBox>
      </div>
    </div>
  );
}
