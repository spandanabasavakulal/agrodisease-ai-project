import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Sprout, FlaskConical, Lightbulb, ShieldAlert, Leaf, Loader2, ArrowRight, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoBadge, InfoField, PageHeader, Panel, SafetyNotice } from "@/components/common";
import { getRecommendation } from "@/services/recommendationService";
import { analysisStore, useAnalysis } from "@/hooks/useAnalysis";
import type { Recommendation } from "@/types";

export const Route = createFileRoute("/recommendations")({
  head: () => ({
    meta: [
      { title: "Agrochemical Recommendation — AgroDisease AI" },
      { name: "description", content: "Treatment and agrochemical guidance matched to the detected crop disease." },
      { property: "og:title", content: "Agrochemical Recommendation — AgroDisease AI" },
      { property: "og:description", content: "Crop + disease lookup against a structured treatment dataset." },
    ],
  }),
  component: RecommendationPage,
});

export function RecommendationCards({ rec }: { rec: Recommendation }) {
  const items = [
    { icon: Sprout, label: "Treatment Category", value: rec.treatmentCategory },
    { icon: FlaskConical, label: "Agrochemical / Active Ingredient", value: `${rec.agrochemical} — ${rec.activeIngredient}` },
    { icon: Lightbulb, label: "Reason for Recommendation", value: rec.reason },
    { icon: ShieldAlert, label: "Precautions", value: rec.precautions },
    { icon: Leaf, label: "Additional Crop Care Advice", value: rec.cropCare },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((i, idx) => (
        <div key={i.label} className={`rounded-2xl border bg-card p-5 shadow-soft ${idx === 1 || idx === 4 ? "md:col-span-2" : ""}`}>
          <div className="flex items-center gap-2 text-sm font-bold text-forest">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-leaf-soft text-primary"><i.icon className="h-4 w-4" /></span>
            {i.label}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-foreground/85">{i.value}</p>
        </div>
      ))}
    </div>
  );
}

function RecommendationPage() {
  const { prediction, recommendation, recommendationChecked, imageUrl } = useAnalysis();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!prediction || recommendationChecked) return;
    setLoading(true);
    getRecommendation(prediction.crop, prediction.disease)
      .then((rec) => {
        analysisStore.set({ recommendation: rec, recommendationChecked: true });
        analysisStore.addHistory({
          id: `u-${Date.now()}`,
          date: new Date().toISOString().slice(0, 10),
          crop: prediction.crop,
          disease: prediction.disease,
          confidence: prediction.confidence,
          status: rec ? "Available" : "Not Found",
          isDemo: prediction.isDemo,
        });
      })
      .finally(() => setLoading(false));
  }, [prediction, recommendationChecked]);

  if (!prediction) {
    return (
      <div>
        <PageHeader title="Agrochemical Recommendation" />
        <Panel className="text-center">
          <p className="text-muted-foreground">No prediction yet. Analyze a leaf image first to get a recommendation.</p>
          <Button asChild className="mt-4"><Link to="/detect"><ScanLine /> Go to Disease Detection</Link></Button>
        </Panel>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agrochemical Recommendation"
        description="The predicted crop and disease are normalised and used as the lookup key in the recommendation dataset."
        badge={recommendation?.isDemo || prediction.isDemo ? <DemoBadge>Demo Recommendation Data</DemoBadge> : undefined}
      />
      <div className="grid grid-cols-2 gap-3 sm:max-w-md">
        <InfoField label="Crop" value={prediction.crop} />
        <InfoField label="Disease" value={prediction.disease} />
      </div>
      {loading ? (
        <Panel className="flex items-center gap-3 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin text-primary" /> Searching recommendation dataset…</Panel>
      ) : recommendation ? (
        <>
          <RecommendationCards rec={recommendation} />
          <SafetyNotice />
        </>
      ) : (
        <Panel><p className="text-muted-foreground">No matching entry found in the recommendation dataset for this crop and disease. Please consult your local agricultural extension officer.</p></Panel>
      )}
      <div className="flex flex-wrap gap-3">
        {imageUrl && <Button size="lg" onClick={() => navigate({ to: "/result" })}>View Complete Result <ArrowRight /></Button>}
        <Button size="lg" variant="outline" asChild><Link to="/detect">Analyze Another Image</Link></Button>
      </div>
    </div>
  );
}
