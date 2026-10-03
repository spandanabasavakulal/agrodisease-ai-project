import { API_URL } from "@/config/project";
import { DEMO_RECOMMENDATIONS } from "@/data/demo";
import { normalizeKey } from "@/utils/diseaseMapping";
import type { Recommendation } from "@/types";

/**
 * POST {VITE_API_URL}/recommend with { crop, disease }.
 * Expected response: { treatment, agrochemical, active_ingredient, precautions, reason?, crop_care? }
 * Without a backend, looks up clearly-flagged DEMO reference data. Returns null if no match.
 */
export async function getRecommendation(crop: string, disease: string): Promise<Recommendation | null> {
  if (API_URL) {
    const res = await fetch(`${API_URL}/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ crop, disease }),
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Recommendation failed (${res.status})`);
    const d = await res.json();
    return {
      crop,
      disease,
      treatmentCategory: d.treatment ?? "—",
      agrochemical: d.agrochemical ?? "—",
      activeIngredient: d.active_ingredient ?? "—",
      reason: d.reason ?? "—",
      precautions: d.precautions ?? "—",
      cropCare: d.crop_care ?? "—",
      isDemo: false,
    };
  }
  await new Promise((r) => setTimeout(r, 600));
  const key = normalizeKey(crop, disease);
  const hit = DEMO_RECOMMENDATIONS.find((r) => normalizeKey(r.crop, r.disease) === key);
  return hit ? { ...hit, isDemo: true } : null;
}
