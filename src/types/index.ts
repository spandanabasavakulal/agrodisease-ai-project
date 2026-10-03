export interface Prediction {
  crop: string;
  disease: string;
  confidence: number; // 0..1
  isDemo: boolean;
}

export interface Recommendation {
  crop: string;
  disease: string;
  treatmentCategory: string;
  agrochemical: string;
  activeIngredient: string;
  reason: string;
  precautions: string;
  cropCare: string;
  isDemo: boolean;
}

export type RecommendationStatus = "Available" | "Not Found" | "Pending";

export interface DetectionRecord {
  id: string;
  date: string; // ISO
  crop: string;
  disease: string;
  confidence: number;
  status: RecommendationStatus;
  isDemo: boolean;
}

export type SystemState = "connected" | "demo" | "disconnected" | "configured";
