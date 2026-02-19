"use client";

import { useCompetitionWizardStore, type MetricType } from "@/lib/stores/competition-wizard-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const METRIC_OPTIONS: {
  value: MetricType;
  title: string;
  description: string;
  examples: string[];
}[] = [
  {
    value: "QUANTITY",
    title: "Quantity total",
    description: "Track measurable amounts like minutes, distance, or volume",
    examples: ["minutes studied", "liters of water", "kilometers ran"],
  },
  {
    value: "COUNT",
    title: "Number of times",
    description: "Track how many times you performed the activity",
    examples: ["study sessions", "workouts", "meditation sessions"],
  },
  {
    value: "CHECK",
    title: "Daily completion",
    description: "Track whether you completed the habit each day",
    examples: ["studied today", "exercised today", "read today"],
  },
];

export function WizardStepMetricType() {
  const { metricType, setMetricType, nextStep, prevStep } = useCompetitionWizardStore();

  function handleSelect(value: MetricType) {
    setMetricType(value);
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">How will this competition be measured?</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Choose the type of metric for tracking progress.
        </p>
      </div>
      <div className="space-y-3">
        {METRIC_OPTIONS.map((option) => (
          <Card
            key={option.value}
            className={cn(
              "cursor-pointer transition-colors",
              metricType === option.value
                ? "border-primary ring-1 ring-primary"
                : "hover:border-muted-foreground/50"
            )}
            onClick={() => handleSelect(option.value)}
          >
            <CardContent className="py-4">
              <p className="font-medium">{option.title}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {option.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {option.examples.map((ex) => (
                  <span
                    key={ex}
                    className="text-xs bg-muted px-2 py-0.5 rounded"
                  >
                    {ex}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={prevStep} className="flex-1">
          Back
        </Button>
        <Button onClick={nextStep} className="flex-1">
          Continue
        </Button>
      </div>
    </div>
  );
}
