"use client";

import { useState } from "react";
import { format, addDays } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCompetitionWizardStore } from "@/lib/stores/competition-wizard-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function WizardStepDates() {
  const router = useRouter();
  const store = useCompetitionWizardStore();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const today = format(new Date(), "yyyy-MM-dd");
  const defaultEnd = format(addDays(new Date(), 30), "yyyy-MM-dd");

  const [localStart, setLocalStart] = useState(store.startDate || today);
  const [localEnd, setLocalEnd] = useState(store.endDate || defaultEnd);

  async function handleCreate() {
    if (!localStart || !localEnd) {
      setError("Both dates are required");
      return;
    }
    if (localEnd < localStart) {
      setError("End date must be on or after start date");
      return;
    }

    store.setDateRange(localStart, localEnd);
    setSubmitting(true);

    const res = await fetch("/api/competitions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: store.name,
        description: store.description || undefined,
        metricType: store.metricType,
        unit: store.metricType === "CHECK" ? undefined : store.unit,
        rankingMethod: store.rankingMethod,
        startDate: localStart,
        endDate: localEnd,
      }),
    });

    if (res.ok) {
      const competition = await res.json();
      store.setCreated(competition.id, competition.inviteCode);
      store.setStep(5); // confirmation step
    } else {
      toast.error("Failed to create competition");
    }
    setSubmitting(false);
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Set the date range</h2>
        <p className="text-sm text-muted-foreground mt-1">
          When does this competition start and end?
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={localStart}
            onChange={(e) => {
              setLocalStart(e.target.value);
              setError("");
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={localEnd}
            onChange={(e) => {
              setLocalEnd(e.target.value);
              setError("");
            }}
          />
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={store.prevStep}
          className="flex-1"
          disabled={submitting}
        >
          Back
        </Button>
        <Button
          onClick={handleCreate}
          className="flex-1"
          disabled={submitting}
        >
          {submitting ? "Creating..." : "Create Competition"}
        </Button>
      </div>
    </div>
  );
}
