"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuantityInput } from "@/components/quantity-input";
import { CountInput } from "@/components/count-input";
import { CheckInput } from "@/components/check-input";

interface EntryInputProps {
  competitionId: string;
  metricType: "QUANTITY" | "COUNT" | "CHECK";
  unit: string | null;
  todayEntries: { id: string; amount: number }[];
  onEntryAdded: () => void;
}

export function EntryInput({
  competitionId,
  metricType,
  unit,
  todayEntries,
  onEntryAdded,
}: EntryInputProps) {
  const [loading, setLoading] = useState(false);

  async function addEntry(amount?: number) {
    setLoading(true);
    const res = await fetch(`/api/competitions/${competitionId}/entries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: amount ?? 1,
        date: new Date().toISOString().split("T")[0],
      }),
    });

    if (res.ok) {
      onEntryAdded();
      if (metricType === "CHECK") {
        toast.success("Marked as completed");
      } else {
        toast.success("Entry added");
      }
    } else {
      const data = await res.json();
      toast.error(data.error || "Failed to add entry");
    }
    setLoading(false);
  }

  const todayCount = todayEntries.reduce((sum, e) => sum + e.amount, 0);
  const isChecked = todayEntries.length > 0;

  const title =
    metricType === "QUANTITY"
      ? "Add Entry"
      : metricType === "COUNT"
        ? `Add ${unit || "session"}`
        : "Daily Check";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {metricType === "QUANTITY" && (
          <QuantityInput
            unit={unit || ""}
            loading={loading}
            onAdd={(amount) => addEntry(amount)}
          />
        )}
        {metricType === "COUNT" && (
          <CountInput
            unit={unit || "times"}
            todayCount={todayCount}
            loading={loading}
            onAdd={() => addEntry()}
          />
        )}
        {metricType === "CHECK" && (
          <CheckInput
            completed={isChecked}
            loading={loading}
            onMark={() => addEntry()}
          />
        )}
      </CardContent>
    </Card>
  );
}
