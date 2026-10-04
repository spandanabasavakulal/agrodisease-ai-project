import type { SystemState } from "@/types";

/** Backend base URL. Set VITE_API_URL to your FastAPI server to enable real calls. */
export const API_URL: string | undefined = import.meta.env['VITE_API_URL'] || undefined;
export const BACKEND_CONNECTED = Boolean(API_URL);

/** Edit these when your model is trained. Use null for metrics that are not available. */
export const MODEL_INFO = {
  type: "Deep Learning Image Classifier",
  candidates: "EfficientNetB0",
  trainingDataset: "Tomato Leaf Illness Detection",
  task: "Tomato leaf condition classification",
  explainability: "Optional XAI module to be integrated later",
  metrics: {
    accuracy: 0.92,
    precision: 0.9241,
    recall: 0.9282,
    f1: 0.9183,
  },
};

export const SYSTEM_STATUS: { label: string; value: string; state: SystemState }[] = [
  { label: "Disease Detection Model", value: BACKEND_CONNECTED ? "Connected" : "Not Connected", state: BACKEND_CONNECTED ? "connected" : "disconnected" },
  { label: "Recommendation Engine", value: BACKEND_CONNECTED ? "Connected" : "Demo Mode", state: BACKEND_CONNECTED ? "connected" : "demo" },
  { label: "Backend API", value: BACKEND_CONNECTED ? "Connected" : "Not Connected", state: BACKEND_CONNECTED ? "connected" : "disconnected" },
  { label: "Database", value: "Demo Data", state: "demo" },
  { label: "Dataset", value: "Configured", state: "configured" },
];
