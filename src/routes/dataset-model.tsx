import { createFileRoute } from "@tanstack/react-router";
import {
  Database,
  BookOpen,
  ArrowDown,
  Cpu,
  Layers,
  Target,
  Eye,
  Image as ImageIcon,
  Grid3x3,
} from "lucide-react";
import {
  PageHeader,
  Panel,
  SystemStatusCard,
} from "@/components/common";
import { MODEL_INFO } from "@/config/project";

export const Route = createFileRoute("/dataset-model")({
  head: () => ({
    meta: [
      {
        title: "Dataset & Model — AgroDisease AI",
      },
      {
        name: "description",
        content:
          "Technical overview of the tomato leaf condition dataset, EfficientNetB0 model, evaluation results, and recommendation framework.",
      },
      {
        property: "og:title",
        content: "Dataset & Model — AgroDisease AI",
      },
      {
        property: "og:description",
        content:
          "Technical overview of the dataset, AI architecture, and model evaluation.",
      },
    ],
  }),
  component: DatasetModelPage,
});


const PIPELINE = [
  "Tomato Leaf Image",
  "Image Preprocessing",
  "EfficientNetB0",
  "Leaf Condition Classification",
  "Management Guidance",
  "Agrochemical Guidance",
  "Farmer",
];

const DETECTION_LAST_INDEX = 3;


/* Actual evaluation results from the trained model */
const CONFUSION_MATRIX = [
  [24, 0, 0, 0],
  [0, 26, 1, 0],
  [0, 0, 21, 0],
  [3, 0, 4, 21],
];

const CLASS_NAMES = [
  "Dried Leaves",
  "Healthy Leaves",
  "Leaves With Stains",
  "Leaves With Yellow Stains",
];


function DatasetModelPage() {
  const m = MODEL_INFO.metrics;

  const metrics = [
    {
      label: "Accuracy",
      v: m.accuracy,
    },
    {
      label: "Precision",
      v: m.precision,
    },
    {
      label: "Recall",
      v: m.recall,
    },
    {
      label: "F1-Score",
      v: m.f1,
    },
  ];

  const info = [
    {
      icon: Cpu,
      label: "Model Type",
      value: MODEL_INFO.type,
    },
    {
      icon: Layers,
      label: "Model",
      value: MODEL_INFO.candidates,
    },
    {
      icon: Database,
      label: "Training Dataset",
      value: MODEL_INFO.trainingDataset,
    },
    {
      icon: Target,
      label: "Task",
      value: MODEL_INFO.task,
    },
    {
      icon: Eye,
      label: "Explainability",
      value: MODEL_INFO.explainability,
    },
  ];


  return (
    <div className="space-y-6">

      <PageHeader
        title="Dataset & Model"
        description="Technical overview of the tomato leaf condition dataset, deep learning model, evaluation results, and management recommendation framework."
      />


      {/* DATASET INFORMATION */}
      <div className="grid gap-6 md:grid-cols-2">

        <Panel
          title="Disease Detection Dataset"
          icon={<ImageIcon className="h-4 w-4" />}
        >
          <div className="text-2xl font-display font-semibold text-forest">
            Tomato Leaf Illness Detection
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            <strong className="text-foreground">
              Purpose:
            </strong>{" "}
            Training the image classification model to identify four
            tomato leaf conditions.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">

            <div className="rounded-lg bg-leaf-soft p-3">
              <div className="font-semibold text-forest">
                Training Images
              </div>
              <div className="mt-1 text-muted-foreground">
                384
              </div>
            </div>

            <div className="rounded-lg bg-leaf-soft p-3">
              <div className="font-semibold text-forest">
                Test Images
              </div>
              <div className="mt-1 text-muted-foreground">
                100
              </div>
            </div>

            <div className="col-span-2 rounded-lg bg-leaf-soft p-3">
              <div className="font-semibold text-forest">
                Classes
              </div>

              <div className="mt-1 text-muted-foreground">
                Dried Leaves · Healthy Leaves · Leaves With Stains ·
                Leaves With Yellow Stains
              </div>
            </div>

          </div>
        </Panel>


        <Panel
          title="Management Recommendation Module"
          icon={<BookOpen className="h-4 w-4" />}
        >
          <div className="text-2xl font-display font-semibold text-forest">
            Condition Management Knowledge Base
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            <strong className="text-foreground">
              Purpose:
            </strong>{" "}
            Provides management guidance based on the detected tomato
            leaf condition.
          </p>

          <div className="mt-4 rounded-lg bg-leaf-soft p-3 text-sm text-muted-foreground">
            The current visual classifier identifies leaf conditions.
            It does not establish a specific pathogen from the image
            alone, so agrochemical selection is not presented as an
            automatic pesticide prescription.
          </div>
        </Panel>

      </div>


      {/* AI ARCHITECTURE */}
      <Panel title="AI Architecture">

        <div className="mx-auto flex max-w-sm flex-col items-center">

          {PIPELINE.map((step, index) => {

            const isDetection =
              index <= DETECTION_LAST_INDEX;

            const isFinal =
              index === PIPELINE.length - 1;

            return (
              <div
                key={step}
                className="flex w-full flex-col items-center"
              >

                <div
                  className={`w-full rounded-xl px-4 py-3 text-center text-sm font-semibold ${
                    isDetection
                      ? "bg-primary text-primary-foreground"
                      : isFinal
                        ? "bg-forest text-primary-foreground"
                        : "bg-accent text-accent-foreground"
                  }`}
                >
                  {step}
                </div>

                {index < PIPELINE.length - 1 && (
                  <ArrowDown className="my-1 h-4 w-4 text-muted-foreground" />
                )}

              </div>
            );
          })}

        </div>


        <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">

          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded bg-primary" />
            Detection module
          </span>

          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded bg-accent" />
            Management / recommendation module
          </span>

          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded bg-forest" />
            Farmer output
          </span>

        </div>

      </Panel>


      {/* MODEL EVALUATION */}
      <Panel title="Model Evaluation">

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

          {metrics.map((x) => (

            <div
              key={x.label}
              className="rounded-xl border border-dashed p-4"
            >

              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {x.label}
              </div>

              {x.v == null ? (
                <div className="mt-2 text-sm font-semibold text-warning">
                  Not Available
                </div>
              ) : (
                <div className="mt-2 text-2xl font-extrabold text-forest">
                  {(x.v * 100).toFixed(1)}%
                </div>
              )}

            </div>

          ))}

        </div>


        {/* CONFUSION MATRIX */}
        <div className="mt-6 rounded-xl border p-5">

          <div className="flex items-center gap-2">

            <Grid3x3 className="h-5 w-5 text-primary" />

            <div className="font-bold text-forest">
              Confusion Matrix
            </div>

          </div>


          <div className="mt-4 overflow-x-auto">

            <table className="w-full border-collapse text-xs">

              <thead>

                <tr>

                  <th className="border p-2 text-left">
                    Actual ↓ / Predicted →
                  </th>

                  {CLASS_NAMES.map((name) => (
                    <th
                      key={name}
                      className="border p-2 text-center"
                    >
                      {name}
                    </th>
                  ))}

                </tr>

              </thead>


              <tbody>

                {CONFUSION_MATRIX.map((row, rowIndex) => (

                  <tr key={CLASS_NAMES[rowIndex]}>

                    <th className="border p-2 text-left">
                      {CLASS_NAMES[rowIndex]}
                    </th>

                    {row.map((value, columnIndex) => (

                      <td
                        key={columnIndex}
                        className={`border p-2 text-center font-semibold ${
                          rowIndex === columnIndex
                            ? "bg-leaf-soft text-forest"
                            : "text-muted-foreground"
                        }`}
                      >
                        {value}
                      </td>

                    ))}

                  </tr>

                ))}

              </tbody>

            </table>

          </div>


          <p className="mt-4 text-xs text-muted-foreground">
            Evaluation is based on the 100-image held-out test set.
            Results indicate test-set performance and should not be
            interpreted as guaranteed real-world field accuracy.
          </p>

        </div>

      </Panel>


      {/* MODEL INFORMATION + SYSTEM STATUS */}
      <div className="grid gap-6 lg:grid-cols-3">

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">

          {info.map((item) => (

            <div
              key={item.label}
              className="rounded-2xl border bg-card p-5 shadow-soft"
            >

              <item.icon className="h-5 w-5 text-primary" />

              <div className="mt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {item.label}
              </div>

              <div className="mt-1 font-bold text-forest">
                {item.value}
              </div>

            </div>

          ))}

        </div>


        <SystemStatusCard />

      </div>

    </div>
  );
}