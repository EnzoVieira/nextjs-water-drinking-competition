import { create } from "zustand";
import { persist } from "zustand/middleware";

export type MetricType = "QUANTITY" | "COUNT" | "CHECK";
export type RankingMethod = "TOTAL" | "CONSISTENCY" | "COMBINED";

export interface CompetitionWizardState {
  step: number;
  name: string;
  description: string;
  metricType: MetricType;
  unit: string;
  rankingMethod: RankingMethod;
  startDate: string;
  endDate: string;
  createdCompetitionId: string | null;
  createdInviteCode: string | null;
}

export interface CompetitionWizardActions {
  setStep: (step: number) => void;
  setBasicInfo: (name: string, description: string) => void;
  setMetricType: (metricType: MetricType) => void;
  setUnit: (unit: string) => void;
  setRankingMethod: (rankingMethod: RankingMethod) => void;
  setDateRange: (startDate: string, endDate: string) => void;
  setCreated: (id: string, inviteCode: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

const TOTAL_STEPS = 6; // 0-based: basic(0), metric(1), unit(2), ranking(3), dates(4), confirmation(5)

const initialState: CompetitionWizardState = {
  step: 0,
  name: "",
  description: "",
  metricType: "QUANTITY",
  unit: "",
  rankingMethod: "COMBINED",
  startDate: "",
  endDate: "",
  createdCompetitionId: null,
  createdInviteCode: null,
};

export const useCompetitionWizardStore = create<
  CompetitionWizardState & CompetitionWizardActions
>()(
  persist(
    (set, get) => ({
      ...initialState,

      setStep: (step) => set({ step }),

      setBasicInfo: (name, description) => set({ name, description }),

      setMetricType: (metricType) => set({ metricType }),

      setUnit: (unit) => set({ unit }),

      setRankingMethod: (rankingMethod) => set({ rankingMethod }),

      setDateRange: (startDate, endDate) => set({ startDate, endDate }),

      setCreated: (id, inviteCode) =>
        set({ createdCompetitionId: id, createdInviteCode: inviteCode }),

      nextStep: () => {
        const { step, metricType } = get();
        let next = step + 1;
        // Skip unit step (2) when metricType is CHECK
        if (next === 2 && metricType === "CHECK") {
          next = 3;
        }
        if (next < TOTAL_STEPS) {
          set({ step: next });
        }
      },

      prevStep: () => {
        const { step, metricType } = get();
        let prev = step - 1;
        // Skip unit step (2) when metricType is CHECK
        if (prev === 2 && metricType === "CHECK") {
          prev = 1;
        }
        if (prev >= 0) {
          set({ step: prev });
        }
      },

      reset: () => set(initialState),
    }),
    { name: "competition-wizard" }
  )
);
