"use client";

import { useState } from "react";
import { useCompetitionWizardStore } from "@/lib/stores/competition-wizard-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function WizardStepUnit() {
  const { unit, setUnit, nextStep, prevStep } = useCompetitionWizardStore();
  const [localUnit, setLocalUnit] = useState(unit);
  const [error, setError] = useState("");

  function handleContinue() {
    if (!localUnit.trim()) {
      setError("Unit is required");
      return;
    }
    setUnit(localUnit.trim());
    nextStep();
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">What unit will be tracked?</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Define the unit of measurement for this competition.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="unit">Unit</Label>
        <Input
          id="unit"
          placeholder="minutes, meters, pages, sessions, liters..."
          value={localUnit}
          onChange={(e) => {
            setLocalUnit(e.target.value);
            setError("");
          }}
          autoFocus
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={prevStep} className="flex-1">
          Back
        </Button>
        <Button onClick={handleContinue} className="flex-1">
          Continue
        </Button>
      </div>
    </div>
  );
}
