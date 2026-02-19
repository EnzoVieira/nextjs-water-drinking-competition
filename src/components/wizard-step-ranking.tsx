"use client";

import { useCompetitionWizardStore, type RankingMethod } from "@/lib/stores/competition-wizard-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const RANKING_OPTIONS: {
  value: RankingMethod;
  title: string;
  description: string;
  recommended?: boolean;
}[] = [
  {
    value: "TOTAL",
    title: "Total amount",
    description: "User with highest total wins",
  },
  {
    value: "CONSISTENCY",
    title: "Consistency",
    description: "User with longest daily streak wins",
  },
  {
    value: "COMBINED",
    title: "Combined",
    description: "Total amount plus consistency bonus",
    recommended: true,
  },
];

export function WizardStepRanking() {
  const { rankingMethod, setRankingMethod, nextStep, prevStep } =
    useCompetitionWizardStore();

  function handleSelect(value: RankingMethod) {
    setRankingMethod(value);
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">
          How should the winner be determined?
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Choose the ranking method for the leaderboard.
        </p>
      </div>
      <div className="space-y-3">
        {RANKING_OPTIONS.map((option) => (
          <Card
            key={option.value}
            className={cn(
              "cursor-pointer transition-colors",
              rankingMethod === option.value
                ? "border-primary ring-1 ring-primary"
                : "hover:border-muted-foreground/50"
            )}
            onClick={() => handleSelect(option.value)}
          >
            <CardContent className="py-4">
              <div className="flex items-center gap-2">
                <p className="font-medium">{option.title}</p>
                {option.recommended && (
                  <Badge variant="secondary">Recommended</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {option.description}
              </p>
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
