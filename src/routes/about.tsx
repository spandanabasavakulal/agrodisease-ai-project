import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Lightbulb, Target, CheckCircle2 } from "lucide-react";
import { PageHeader, Panel } from "@/components/common";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Project — AgroDisease AI" },
      {
        name: "description",
        content:
          "Problem, proposed solution and goals of the AI-powered crop leaf condition detection and agrochemical management framework.",
      },
      {
        property: "og:title",
        content: "About the Project — AgroDisease AI",
      },
      {
        property: "og:description",
        content:
          "AI-powered crop leaf condition detection and agrochemical management framework.",
      },
    ],
  }),
  component: AboutPage,
});

const COMPONENTS = [
  "Image preprocessing",
  "Deep learning leaf condition classification",
  "Condition-to-management mapping",
  "Treatment and agrochemical guidance",
  "Farmer-friendly dashboard",
  "Future explainable AI support",
];

function AboutPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="About Project"
        description="Final-year engineering project · Artificial Intelligence in Agriculture"
      />

      <section className="bg-hero leaf-pattern rounded-3xl p-6 text-primary-foreground sm:p-8">
        <div className="text-xs font-semibold uppercase tracking-widest opacity-80">
          Project Title
        </div>

        <h2 className="mt-2 text-2xl font-semibold text-primary-foreground sm:text-3xl">
          AI-Powered Crop Disease Detection and Agrochemical Recommendation
          Framework
        </h2>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <Panel
          title="Problem"
          icon={<AlertTriangle className="h-4 w-4" />}
        >
          <p className="text-sm leading-relaxed text-foreground/85">
            Crop diseases and visible leaf abnormalities can reduce crop
            productivity. Identifying plant health problems through manual
            inspection can be time-consuming and may require agricultural
            expertise.
          </p>
        </Panel>

        <Panel
          title="Proposed Solution"
          icon={<Lightbulb className="h-4 w-4" />}
        >
          <p className="text-sm leading-relaxed text-foreground/85">
            An AI-powered framework that analyzes tomato leaf images using
            computer vision and deep learning to identify visual leaf
            conditions. The detected condition is then used to retrieve
            appropriate management guidance from a structured knowledge base.
          </p>
        </Panel>

        <Panel title="Key Components">
          <ul className="grid gap-2 sm:grid-cols-2">
            {COMPONENTS.map((component) => (
              <li
                key={component}
                className="flex items-center gap-2 text-sm"
              >
                <CheckCircle2 className="h-4 w-4 text-primary" />
                {component}
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Project Goal" icon={<Target className="h-4 w-4" />}>
          <p className="text-sm leading-relaxed text-foreground/85">
            Support early identification of visible tomato leaf conditions and
            provide management guidance that can help farmers make more
            informed crop-care decisions. Agrochemical selection is not
            presented as an automatic prescription when the image alone cannot
            establish the underlying cause.
          </p>
        </Panel>
      </div>
    </div>
  );
}