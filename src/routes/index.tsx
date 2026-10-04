import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Upload,
  BookOpen,
  Sprout,
  Activity,
  Cpu,
  ScanLine,
  Microscope,
  ClipboardCheck,
  ArrowRight,
} from "lucide-react";

import { DemoBadge, Panel, SystemStatusCard } from "@/components/common";
import { Button } from "@/components/ui/button";
import { BACKEND_CONNECTED, MODEL_INFO } from "@/config/project";
import { formatConfidence } from "@/utils/diseaseMapping";
import { useAnalysis } from "@/hooks/useAnalysis";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AgroDisease AI" },
      {
        name: "description",
        content:
          "AI-Powered Crop Disease Detection & Agrochemical Recommendation",
      },
      {
        property: "og:title",
        content: "Dashboard — AgroDisease AI",
      },
      {
        property: "og:description",
        content:
          "AI-powered tomato leaf condition detection and management guidance.",
      },
    ],
  }),
  component: Dashboard,
});

const STEPS = [
  {
    icon: Upload,
    title: "Upload Leaf Image",
    text: "Take or choose a clear photo of a single tomato leaf.",
  },
  {
    icon: Cpu,
    title: "AI Leaf Condition Detection",
    text: "The image is preprocessed and classified using the EfficientNetB0 deep-learning model.",
  },
  {
    icon: Microscope,
    title: "Condition Identification",
    text: "The model identifies one of four visual tomato leaf conditions.",
  },
  {
    icon: ClipboardCheck,
    title: "Management Guidance",
    text: "Condition-specific management guidance is retrieved from the recommendation module.",
  },
];

const SUPPORTED_CONDITIONS = [
  "Dried Leaves",
  "Healthy Leaves",
  "Leaves With Stains",
  "Leaves With Yellow Stains",
];

function Dashboard() {
  const { history } = useAnalysis();

  const stats = [
    {
      icon: Sprout,
      label: "Supported Crop",
      value: "Tomato",
      note: "Current model",
    },
    {
      icon: Microscope,
      label: "Leaf Conditions",
      value: SUPPORTED_CONDITIONS.length,
      note: "4 classes",
    },
    {
      icon: Activity,
      label: "Predictions",
      value: history.length,
      note: "This device",
    },
    {
      icon: Cpu,
      label: "Model Status",
      value: BACKEND_CONNECTED ? "Connected" : "Not Connected",
      note: BACKEND_CONNECTED ? MODEL_INFO.candidates : "Backend offline",
    },
  ];

  return (
    <div className="space-y-6">
      <p className="text-sm font-semibold text-primary">
        Welcome to AgroDisease AI
      </p>

      <section className="bg-hero leaf-pattern relative overflow-hidden rounded-3xl p-6 text-primary-foreground sm:p-10">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-semibold leading-tight text-primary-foreground sm:text-4xl">
            AI-Powered Crop Disease &amp; Agrochemical Recommendation
          </h1>

          <p className="mt-3 text-primary-foreground/85">
            Upload a tomato leaf image to identify its visual condition and
            receive appropriate agrochemical and crop-management guidence.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="secondary">
              <Link to="/detect">
                <Upload /> Upload Leaf Image
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="ghost"
              className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link to="/dataset-model">
                <BookOpen /> Learn About the AI
              </Link>
            </Button>
          </div>
        </div>

        <Sprout className="pointer-events-none absolute -bottom-6 -right-6 hidden h-56 w-56 text-primary-foreground/10 md:block" />
      </section>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border bg-card p-4 shadow-soft"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-leaf-soft text-primary">
              <s.icon className="h-4 w-4" />
            </div>

            <div className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {s.label}
            </div>

            <div className="mt-1 text-xl font-extrabold text-forest">
              {s.value}
            </div>

            <div className="mt-1 text-xs text-muted-foreground">
              {s.note}
            </div>
          </div>
        ))}
      </div>

      <Panel title="How It Works">
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li
              key={s.title}
              className="rounded-xl bg-leaf-soft p-4"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {i + 1}
                </span>

                <s.icon className="h-4 w-4 text-primary" />
              </div>

              <div className="mt-3 font-bold text-forest">
                {s.title}
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                {s.text}
              </p>
            </li>
          ))}
        </ol>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel
          title="Recent Detections"
          icon={<ScanLine className="h-4 w-4" />}
          action={<DemoBadge />}
          className="lg:col-span-2"
        >
          {history.length === 0 ? (
            <div className="rounded-xl bg-leaf-soft p-6 text-center">
              <p className="text-sm text-muted-foreground">
                No tomato leaf images have been analyzed on this device yet.
              </p>

              <Button asChild className="mt-4">
                <Link to="/detect">
                  <ScanLine /> Start Detection
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <ul className="divide-y">
                {history.slice(0, 4).map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center justify-between gap-3 py-3 text-sm"
                  >
                    <div>
                      <div className="font-semibold text-forest">
                        {r.crop} · {r.disease}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {r.date}
                      </div>
                    </div>

                    <span className="font-semibold text-primary">
                      {formatConfidence(r.confidence)}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                to="/history"
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary"
              >
                View full history
                <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </Panel>

        <SystemStatusCard />
      </div>
    </div>
  );
}