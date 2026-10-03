import { useSyncExternalStore } from "react";
import type { DetectionRecord, Prediction, Recommendation } from "@/types";

interface AnalysisState {
  imageUrl: string | null;
  prediction: Prediction | null;
  recommendation: Recommendation | null;
  recommendationChecked: boolean;
  history: DetectionRecord[]; // user's session analyses (saved to localStorage)
}

const KEY = "agrodisease-history";
let state: AnalysisState = {
  imageUrl: null,
  prediction: null,
  recommendation: null,
  recommendationChecked: false,
  history: [],
};
let loaded = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...state, history: JSON.parse(raw) };
  } catch {}
}

export const analysisStore = {
  set(patch: Partial<AnalysisState>) {
    state = { ...state, ...patch };
    emit();
  },
  reset() {
    state = { ...state, imageUrl: null, prediction: null, recommendation: null, recommendationChecked: false };
    emit();
  },
  addHistory(rec: DetectionRecord) {
    state = { ...state, history: [rec, ...state.history.filter((h) => h.id !== rec.id)] };
    try {
      localStorage.setItem(KEY, JSON.stringify(state.history));
    } catch {}
    emit();
  },
};

const serverState = state;
export function useAnalysis() {
  return useSyncExternalStore(
    (l) => {
      load();
      listeners.add(l);
      emit();
      return () => listeners.delete(l);
    },
    () => state,
    () => serverState,
  );
}
