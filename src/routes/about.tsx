import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Lightbulb, Target, CheckCircle2 } from "lucide-react";
import { PageHeader, Panel } from "@/components/common";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Project — AgroDisease AI" },
      { name: "description", content: "Problem, proposed solution and goals of the crop disease detection and recommendation framework." },
      { property: "og:title", content: "About the Project — AgroDisease AI" },
      { property: "og:description", content: "Final-year AI/ML project in agricultural technology." },
    ],
  }),
  component: AboutPage,
});

const COMPONENTS = ["Image preprocessing", "Deep learning disease classification", "Disease mapping", "Treatment recommendation", "Farmer-friendly dashboard", "Future explainable AI support"];

function AboutPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="About Project" description="Final-year engineering project · Artificial Intelligence in Agriculture" />
      <section className="bg-hero leaf-pattern rounded-3xl p-6 text-primary-foreground sm:p-8">
        <div className="text-xs font-semibold uppercase tracking-widest opacity-80">Project Title</div>
        <h2 className="mt-2 text-2xl font-semibold text-primary-foreground sm:text-3xl">AI-Powered Crop Disease Detection and Agrochemical Recommendation Framework</h2>
      </section>
      <div className="grid gap-6 md:grid-cols-2">
        <Panel title="Problem" icon={<AlertTriangle className="h-4 w-4" />}>
          <p className="text-sm leading-relaxed text-foreground/85">Crop diseases can significantly reduce agricultural productivity. Traditional disease identification may depend on manual inspection and expert knowledge.</p>
        </Panel>
        <Panel title="Proposed Solution" icon={<Lightbulb className="h-4 w-4" />}>
          <p className="text-sm leading-relaxed text-foreground/85">An AI-powered framework that analyzes crop leaf images using computer vision/deep learning and provides a corresponding treatment recommendation using structured agricultural knowledge.</p>
        </Panel>
        <Panel title="Key Components">
          <ul className="grid gap-2 sm:grid-cols-2">
            {COMPONENTS.map((c) => <li key={c} className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-primary" /> {c}</li>)}
          </ul>
        </Panel>
        <Panel title="Project Goal" icon={<Target className="h-4 w-4" />}>
          <p className="text-sm leading-relaxed text-foreground/85">Support early crop disease identification and assist farmers in making informed treatment decisions.</p>
        </Panel>
      </div>
    </div>
  );
}
