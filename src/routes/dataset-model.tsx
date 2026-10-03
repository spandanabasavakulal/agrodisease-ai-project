import { createFileRoute } from "@tanstack/react-router";
import { Database, BookOpen, ArrowDown, Cpu, Layers, Target, Eye, Image as ImageIcon, Grid3x3 } from "lucide-react";
import { PageHeader, Panel, SystemStatusCard } from "@/components/common";
import { MODEL_INFO } from "@/config/project";

export const Route = createFileRoute("/dataset-model")({
  head: () => ({
    meta: [
      { title: "Dataset & Model — AgroDisease AI" },
      { name: "description", content: "PlantVillage for detection, Indian Crop Disease Dataset for recommendations, and the AI architecture." },
      { property: "og:title", content: "Dataset & Model — AgroDisease AI" },
      { property: "og:description", content: "Technical overview of datasets, architecture and model evaluation." },
    ],
  }),
  component: DatasetModelPage,
});

const PIPELINE = ["Leaf Image", "Image Preprocessing", "Deep Learning Model", "Disease Classification", "Crop + Disease", "Disease Mapping", "Recommendation Dataset", "Treatment Recommendation", "Farmer"];
const MODULE_A = 4; // first 5 steps = detection module

function DatasetModelPage() {
  const m = MODEL_INFO.metrics;
  const metrics = [
    { label: "Accuracy", v: m.accuracy },
    { label: "Precision", v: m.precision },
    { label: "Recall", v: m.recall },
    { label: "F1-Score", v: m.f1 },
  ];
  const info = [
    { icon: Cpu, label: "Model Type", value: MODEL_INFO.type },
    { icon: Layers, label: "Possible Model", value: MODEL_INFO.candidates },
    { icon: Database, label: "Training Dataset", value: MODEL_INFO.trainingDataset },
    { icon: Target, label: "Task", value: MODEL_INFO.task },
    { icon: Eye, label: "Explainability", value: MODEL_INFO.explainability },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Dataset & Model" description="Two datasets serve two separate purposes. They are not merged row-by-row; the predicted crop + disease is the lookup key between them." />

      <div className="grid gap-6 md:grid-cols-2">
        <Panel title="Disease Detection Dataset" icon={<ImageIcon className="h-4 w-4" />}>
          <div className="text-2xl font-display font-semibold text-forest">PlantVillage</div>
          <p className="mt-2 text-sm text-muted-foreground"><strong className="text-foreground">Purpose:</strong> Training the image-based crop disease classification model.</p>
        </Panel>
        <Panel title="Recommendation Dataset" icon={<BookOpen className="h-4 w-4" />}>
          <div className="text-2xl font-display font-semibold text-forest">Indian Crop Disease Dataset</div>
          <p className="mt-2 text-sm text-muted-foreground"><strong className="text-foreground">Purpose:</strong> Providing structured crop, disease and treatment information for the recommendation module.</p>
        </Panel>
      </div>

      <Panel title="AI Architecture">
        <div className="mx-auto flex max-w-sm flex-col items-center">
          {PIPELINE.map((s, i) => (
            <div key={s} className="flex w-full flex-col items-center">
              <div className={`w-full rounded-xl px-4 py-3 text-center text-sm font-semibold ${i <= MODULE_A ? "bg-primary text-primary-foreground" : i === PIPELINE.length - 1 ? "bg-forest text-primary-foreground" : "bg-accent text-accent-foreground"}`}>
                {s}
              </div>
              {i < PIPELINE.length - 1 && <ArrowDown className="my-1 h-4 w-4 text-muted-foreground" />}
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-primary" /> Detection module (PlantVillage)</span>
          <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-accent" /> Recommendation module (Indian Crop Disease Dataset)</span>
        </div>
      </Panel>

      <Panel title="Model Evaluation">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {metrics.map((x) => (
            <div key={x.label} className="rounded-xl border border-dashed p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{x.label}</div>
              {x.v == null ? <div className="mt-2 text-sm font-semibold text-warning">Not Available — Model Training Pending</div> : <div className="mt-2 text-2xl font-extrabold text-forest">{(x.v * 100).toFixed(1)}%</div>}
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
          <Grid3x3 className="h-8 w-8 text-muted-foreground" />
          <div className="mt-2 font-bold text-forest">Confusion Matrix</div>
          <div className="text-sm text-warning">Not Available — Model Training Pending</div>
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
          {info.map((i) => (
            <div key={i.label} className="rounded-2xl border bg-card p-5 shadow-soft">
              <i.icon className="h-5 w-5 text-primary" />
              <div className="mt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{i.label}</div>
              <div className="mt-1 font-bold text-forest">{i.value}</div>
            </div>
          ))}
        </div>
        <SystemStatusCard />
      </div>
    </div>
  );
}
