import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, RotateCcw, Sprout, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DemoBadge,
  InfoField,
  PageHeader,
  Panel,
  SafetyNotice,
} from "@/components/common";
import { analysisStore, useAnalysis } from "@/hooks/useAnalysis";
import { formatConfidence } from "@/utils/diseaseMapping";
import { RecommendationCards } from "./recommendations";
import type { Prediction, Recommendation } from "@/types";

export const Route = createFileRoute("/result")({
  head: () => ({
    meta: [
      { title: "Analysis Result — AgroDisease AI" },
      {
        name: "description",
        content: "Full tomato leaf condition analysis with treatment guidance.",
      },
      { property: "og:title", content: "Analysis Result — AgroDisease AI" },
      {
        property: "og:description",
        content:
          "Detected tomato leaf condition, confidence and treatment guidance.",
      },
    ],
  }),
  component: ResultPage,
});


/* Convert model class names into user-friendly names */
function formatCondition(condition: string) {
  const conditionNames: Record<string, string> = {
    dried_leaves: "Dried Leaves",
    healthy_leaves: "Healthy Leaves",
    leaves_with_stains: "Leaves With Stains",
    leaves_yellow_stains: "Leaves With Yellow Stains",
  };

  return conditionNames[condition] ?? condition;
}


/* Check whether the detected condition is healthy */
function isHealthyCondition(condition: string) {
  return condition === "healthy_leaves";
}


/* Show an understandable status instead of treating confidence as disease severity */
function conditionStatus(condition: string) {
  return isHealthyCondition(condition) ? "Healthy" : "Requires Attention";
}


/* Download analysis report */
function downloadReport(p: Prediction, r: Recommendation | null) {
  const condition = formatCondition(p.disease);

  const lines = [
    "AgroDisease AI — Analysis Report",
    `Generated: ${new Date().toLocaleString()}`,
    p.isDemo
      ? "NOTICE: DEMO PREDICTION — REAL ML MODEL NOT CONNECTED"
      : "",
    "",
    `Crop: ${p.crop}`,
    `Leaf Condition: ${condition}`,
    `Confidence: ${formatConfidence(p.confidence)}`,
    `Status: ${conditionStatus(p.disease)}`,
    "",
    "Treatment Recommendation",
    r
      ? [
          `Category: ${r.treatmentCategory}`,
          `Agrochemical: ${r.agrochemical}`,
          `Active ingredient: ${r.activeIngredient}`,
          `Reason: ${r.reason}`,
          `Precautions: ${r.precautions}`,
          `Crop care: ${r.cropCare}`,
        ].join("\n")
      : "No recommendation available.",
    "",
    "Recommendation based on available agricultural knowledge data. Verify the product label and local agricultural guidance before application.",
  ];

  const blob = new Blob([lines.join("\n")], {
    type: "text/plain",
  });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `agrodisease-report-${p.crop}-${condition}.txt`.replace(
    /\s+/g,
    "_"
  );

  a.click();
  URL.revokeObjectURL(a.href);
}


function ResultPage() {
  const {
    imageUrl,
    prediction,
    recommendation,
    recommendationChecked,
  } = useAnalysis();

  if (!prediction || !imageUrl) {
    return (
      <div>
        <PageHeader title="Analysis Result" />

        <Panel className="text-center">
          <p className="text-muted-foreground">
            No analysis yet.
          </p>

          <Button asChild className="mt-4">
            <Link to="/detect">
              <ScanLine />
              Start Detection
            </Link>
          </Button>
        </Panel>
      </div>
    );
  }

  const condition = formatCondition(prediction.disease);
  const healthy = isHealthyCondition(prediction.disease);

  return (
    <div className="space-y-6">

      <PageHeader
        title="Analysis Result"
        badge={
          prediction.isDemo ? (
            <DemoBadge>
              Demo Prediction — Real ML Model Not Connected
            </DemoBadge>
          ) : undefined
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Uploaded image */}
        <Panel>
          <img
            src={imageUrl}
            alt="Analyzed tomato leaf"
            className="mx-auto max-h-96 w-full rounded-xl object-contain"
          />
        </Panel>


        {/* Prediction information */}
        <div className="grid content-start gap-3 sm:grid-cols-2">

          <InfoField
            label="Crop Detected"
            value={prediction.crop}
          />

          <InfoField
            label="Leaf Condition"
            value={condition}
          />

          <InfoField
            label="Confidence"
            value={formatConfidence(prediction.confidence)}
          />

          <InfoField
            label="Condition Status"
            value={conditionStatus(prediction.disease)}
          />

          <InfoField
            label="Recommendation Status"
            value={
              !recommendationChecked
                ? "Pending"
                : recommendation
                  ? "Available"
                  : "Not Found"
            }
          />

        </div>
      </div>


      {/* Treatment / management recommendation */}
      <h2 className="text-xl font-semibold">
        Treatment Recommendation
      </h2>

      {recommendation ? (
        <RecommendationCards rec={recommendation} />
      ) : (
        <Panel>
          <p className="text-sm text-muted-foreground">
            {healthy
              ? "No agrochemical treatment is required for healthy leaves."
              : "No recommendation is currently available for this detected condition."}
          </p>
        </Panel>
      )}


      <SafetyNotice />


      {/* Actions */}
      <div className="flex flex-wrap gap-3">

        <Button
          size="lg"
          variant="outline"
          asChild
        >
          <Link
            to="/detect"
            onClick={() => analysisStore.reset()}
          >
            <RotateCcw />
            Analyze Another Image
          </Link>
        </Button>


        <Button
          size="lg"
          variant="secondary"
          asChild
        >
          <Link to="/recommendations">
            <Sprout />
            View Recommendation
          </Link>
        </Button>


        <Button
          size="lg"
          onClick={() =>
            downloadReport(prediction, recommendation)
          }
        >
          <Download />
          Download Report
        </Button>

      </div>

    </div>
  );
}