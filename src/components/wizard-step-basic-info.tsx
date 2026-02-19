"use client";

import { useState } from "react";
import { useCompetitionWizardStore } from "@/lib/stores/competition-wizard-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function WizardStepBasicInfo() {
  const { name, description, setBasicInfo, nextStep } = useCompetitionWizardStore();
  const [localName, setLocalName] = useState(name);
  const [localDescription, setLocalDescription] = useState(description);
  const [error, setError] = useState("");

  function handleContinue() {
    if (!localName.trim()) {
      setError("Name is required");
      return;
    }
    setBasicInfo(localName.trim(), localDescription.trim());
    nextStep();
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Basic Information</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Give your competition a name and description.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="Study Challenge"
          value={localName}
          onChange={(e) => {
            setLocalName(e.target.value);
            setError("");
          }}
          autoFocus
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          rows={2}
          placeholder="Study every day to prepare for exams"
          value={localDescription}
          onChange={(e) => setLocalDescription(e.target.value)}
        />
      </div>
      <Button onClick={handleContinue} className="w-full">
        Continue
      </Button>
    </div>
  );
}
