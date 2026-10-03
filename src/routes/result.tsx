import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, RotateCcw, Sprout, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoBadge, InfoField, PageHeader, Panel, SafetyNotice } from "@/components/common";
import { analysisStore, useAnalysis } from "@/hooks/useAnalysis";
import { formatConfidence } from "@/utils/diseaseMapping";
import { RecommendationCards } from "./recommendations";
import type { Prediction, Recommendation } from "@/types";

export const Route = createFileRoute("/result")({
  head: () => ({
    meta: [
      { title: "Analysis Result — AgroDisease AI" },
      { name: "description", content: "Full crop disease analysis result with treatment recommendation." },
      { property: "og:title", content: "Analysis Result — AgroDisease AI" },
      { property: "og:description", content: "Detected crop, disease, confidence and treatment guidance in one report." },
    ],
  }),
  component: ResultPage,
});

function severity(c: number, disease: string) {
  if (disease === "Healthy") return "None";
  return c >= 0.9 ? "High (indicative)" : c >= 0.75 ? "Moderate (indicative)" : "Low (indicative)";
}

function downloadReport(p: Prediction, r: Recommendation | null) {
  const lines = [
    "AgroDisease AI — Analysis Report",
    `Generated: ${new Date().toLocaleString()}`,
    p.isDemo ? "NOTICE: DEMO PREDICTION — REAL ML MODEL NOT CONNECTED" : "",
    "",
    `Crop: ${p.crop}`,
    `Disease: ${p.disease}`,
    `Confidence: ${formatConfidence(p.confidence)}`,
    "",
    "Treatment Recommendation",
    r
      ? [`Category: ${r.treatmentCategory}`, `Agrochemical: ${r.agrochemical}`, `Active ingredient: ${r.activeIngredient}`, `Reason: ${r.reason}`, `Precautions: ${r.precautions}`, `Crop care: ${r.cropCare}`].join("\n")
      : "No recommendation available.",
    "",
    "Recommendation based on available agricultural knowledge data. Verify the product label and local agricultural guidance before application.",
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `agrodisease-report-${p.crop}-${p.disease}.txt`.replace(/\s+/g, "_");
  a.click();
  URL.revokeObjectURL(a.href);
}

function ResultPage() {
  const { imageUrl, prediction, recommendation, recommendationChecked } = useAnalysis();

  if (!prediction || !imageUrl) {
    return (
      <div>
        <PageHeader title="Analysis Result" />
        <Panel className="text-center">
          <p className="text-muted-foreground">No analysis yet.</p>
          <Button asChild className="mt-4"><Link to="/detect"><ScanLine /> Start Detection</Link></Button>
        </Panel>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Analysis Result" badge={prediction.isDemo ? <DemoBadge>Demo Prediction — Real ML Model Not Connected</DemoBadge> : undefined} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel><img src={imageUrl} alt="Analyzed leaf" className="mx-auto max-h-96 w-full rounded-xl object-contain" /></Panel>
        <div className="grid content-start gap-3 sm:grid-cols-2">
          <InfoField label="Crop Detected" value={prediction.crop} />
          <InfoField label="Disease Detected" value={prediction.disease} />
          <InfoField label="Confidence" value={formatConfidence(prediction.confidence)} />
          <InfoField label="Disease Severity" value={severity(prediction.confidence, prediction.disease)} />
          <InfoField label="Recommendation Status" value={!recommendationChecked ? "Pending" : recommendation ? "Available" : "Not Found"} />
        </div>
      </div>

      <h2 className="text-xl font-semibold">Treatment Recommendation</h2>
      {recommendation ? <RecommendationCards rec={recommendation} /> : <Panel><p className="text-sm text-muted-foreground">Open “View Recommendation” to look up treatment guidance.</p></Panel>}
      <SafetyNotice />

      <div className="flex flex-wrap gap-3">
        <Button size="lg" variant="outline" asChild><Link to="/detect" onClick={() => analysisStore.reset()}><RotateCcw /> Analyze Another Image</Link></Button>
        <Button size="lg" variant="secondary" asChild><Link to="/recommendations"><Sprout /> View Recommendation</Link></Button>
        <Button size="lg" onClick={() => downloadReport(prediction, recommendation)}><Download /> Download Report</Button>
      </div>
    </div>
  );
}
