import { API_URL } from "@/config/project";
import type { Prediction } from "@/types";

export async function predictDisease(image: File): Promise<Prediction> {
  if (!API_URL) {
    throw new Error(
      "Backend API URL is not configured. Please set VITE_API_URL."
    );
  }

  const form = new FormData();
  form.append("file", image);

  const res = await fetch(`${API_URL}/predict`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    throw new Error(`Prediction failed (${res.status})`);
  }

  const data = (await res.json()) as {
    condition: string;
    confidence: number;
    probabilities: Record<string, number>;
  };

  return {
    crop: "Tomato",
    disease: data.condition,
    confidence: data.confidence / 100,
    isDemo: false,
  };
}