// ALL DATA IN THIS FILE IS DEMO DATA. It is NOT output from a trained model.
import type { DetectionRecord, Recommendation } from "@/types";

export const SUPPORTED_CROPS = ["Tomato", "Potato", "Corn", "Apple", "Grape", "Pepper"];

export const DEMO_DISEASE_INFO: Record<string, string> = {
  "Late Blight":
    "A fungal-like (oomycete) disease caused by Phytophthora infestans. Appears as dark, water-soaked lesions on leaves that spread quickly in cool, humid weather.",
  "Early Blight":
    "A fungal disease caused by Alternaria solani. Shows brown spots with concentric rings, usually starting on older, lower leaves.",
  "Common Rust": "A fungal disease producing reddish-brown pustules on both leaf surfaces.",
  Healthy: "No visible disease symptoms detected.",
};

// Demo recommendation knowledge (no dosages, by design).
export const DEMO_RECOMMENDATIONS: Omit<Recommendation, "isDemo">[] = [
  {
    crop: "Tomato",
    disease: "Late Blight",
    treatmentCategory: "Fungicide (protective / systemic)",
    agrochemical: "Copper-based or systemic anti-oomycete fungicide",
    activeIngredient: "e.g. Copper oxychloride, Mancozeb, Metalaxyl (as listed in reference data)",
    reason: "Late blight is caused by an oomycete; protective and anti-oomycete fungicides are commonly referenced for its management.",
    precautions: "Follow the product label strictly. Wear protective equipment. Observe pre-harvest intervals. Do not apply before rain.",
    cropCare: "Remove and destroy infected leaves, improve air circulation, avoid overhead irrigation, and practise crop rotation.",
  },
  {
    crop: "Potato",
    disease: "Early Blight",
    treatmentCategory: "Fungicide (protective)",
    agrochemical: "Broad-spectrum protective fungicide",
    activeIngredient: "e.g. Mancozeb, Chlorothalonil (as listed in reference data)",
    reason: "Early blight is a fungal disease; protective fungicides are commonly referenced alongside cultural practices.",
    precautions: "Read and follow the label. Use protective gear. Keep away from water sources.",
    cropCare: "Remove lower infected leaves, maintain balanced nutrition, and rotate with non-solanaceous crops.",
  },
];

export const DEMO_HISTORY: DetectionRecord[] = [
  { id: "d1", date: "2026-09-28", crop: "Tomato", disease: "Late Blight", confidence: 0.947, status: "Available", isDemo: true },
  { id: "d2", date: "2026-09-25", crop: "Potato", disease: "Early Blight", confidence: 0.912, status: "Available", isDemo: true },
  { id: "d3", date: "2026-09-20", crop: "Corn", disease: "Common Rust", confidence: 0.884, status: "Pending", isDemo: true },
  { id: "d4", date: "2026-09-14", crop: "Tomato", disease: "Healthy", confidence: 0.963, status: "Not Found", isDemo: true },
  { id: "d5", date: "2026-08-30", crop: "Apple", disease: "Apple Scab", confidence: 0.857, status: "Pending", isDemo: true },
];

export const DEMO_ANALYTICS = {
  diseases: [
    { name: "Late Blight", value: 34 },
    { name: "Early Blight", value: 27 },
    { name: "Common Rust", value: 18 },
    { name: "Apple Scab", value: 12 },
    { name: "Leaf Mold", value: 9 },
  ],
  crops: [
    { name: "Tomato", value: 42 },
    { name: "Potato", value: 28 },
    { name: "Corn", value: 17 },
    { name: "Apple", value: 13 },
  ],
  health: [
    { name: "Diseased", value: 68 },
    { name: "Healthy", value: 32 },
  ],
  confidence: [
    { range: "50-60%", count: 3 },
    { range: "60-70%", count: 6 },
    { range: "70-80%", count: 14 },
    { range: "80-90%", count: 29 },
    { range: "90-100%", count: 48 },
  ],
  monthly: [
    { month: "Apr", count: 8 },
    { month: "May", count: 12 },
    { month: "Jun", count: 15 },
    { month: "Jul", count: 21 },
    { month: "Aug", count: 18 },
    { month: "Sep", count: 26 },
  ],
};
