/**
 * Disease mapping / normalization layer between the classifier output
 * (e.g. PlantVillage label "Tomato___Late_blight") and the recommendation dataset key.
 */
const ALIASES: Record<string, string> = {
  "late_blight": "late blight",
  "early_blight": "early blight",
  "common_rust_": "common rust",
};

export function normalizeLabel(s: string) {
  const k = s.trim().toLowerCase().replace(/\s+/g, "_");
  return (ALIASES[k] ?? k.replace(/_+/g, " ")).trim();
}

export function normalizeKey(crop: string, disease: string) {
  return `${normalizeLabel(crop)}::${normalizeLabel(disease)}`;
}

/** Parse a PlantVillage-style class name "Crop___Disease". */
export function parsePlantVillageLabel(label: string) {
  const [crop, disease] = label.split("___");
  return { crop: (crop ?? "").replace(/_/g, " "), disease: (disease ?? "").replace(/_/g, " ") };
}

export const formatConfidence = (c: number) => `${(c * 100).toFixed(1)}%`;
