"use client";

import { useEffect, useState } from "react";
import { useCompetitionWizardStore } from "@/lib/stores/competition-wizard-store";
import { WizardProgress } from "@/components/wizard-progress";
import { WizardStepBasicInfo } from "@/components/wizard-step-basic-info";
import { WizardStepMetricType } from "@/components/wizard-step-metric-type";
import { WizardStepUnit } from "@/components/wizard-step-unit";
import { WizardStepRanking } from "@/components/wizard-step-ranking";
import { WizardStepDates } from "@/components/wizard-step-dates";
import { WizardStepConfirmation } from "@/components/wizard-step-confirmation";
import { Card, CardContent } from "@/components/ui/card";

const STEP_COMPONENTS = [
  WizardStepBasicInfo,
  WizardStepMetricType,
  WizardStepUnit,
  WizardStepRanking,
  WizardStepDates,
  WizardStepConfirmation,
];

export default function NewCompetitionPage() {
  const step = useCompetitionWizardStore((s) => s.step);
  const reset = useCompetitionWizardStore((s) => s.reset);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Reset wizard if user navigates back to this page after completion
  useEffect(() => {
    if (hydrated && step === 5) {
      // Don't reset on confirmation step — user just created a competition
    }
  }, [hydrated, step]);

  if (!hydrated) return null;

  const StepComponent = STEP_COMPONENTS[step];
  const isConfirmation = step === 5;

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Competition</h1>
      {!isConfirmation && <WizardProgress currentStep={step} totalSteps={5} />}
      <Card>
        <CardContent>
          <StepComponent />
        </CardContent>
      </Card>
    </div>
  );
}
