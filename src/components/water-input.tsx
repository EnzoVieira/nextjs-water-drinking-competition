"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { waterEntrySchema, type WaterEntryValues } from "@/lib/schemas";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface WaterInputProps {
  competitionId: string;
  onEntryAdded: () => void;
}

const QUICK_AMOUNTS = [200, 300, 500];

export function WaterInput({ competitionId, onEntryAdded }: WaterInputProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WaterEntryValues>({
    resolver: zodResolver(waterEntrySchema),
  });

  async function addEntry(amount: number) {
    setLoading(true);
    const res = await fetch(`/api/competitions/${competitionId}/entries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount,
        date: new Date().toISOString().split("T")[0],
      }),
    });

    if (res.ok) {
      reset();
      onEntryAdded();
      toast.success(`${amount}ml added`);
    } else {
      toast.error("Failed to add entry");
    }
    setLoading(false);
  }

  function onCustomSubmit(data: WaterEntryValues) {
    addEntry(data.amount);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Water</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          {QUICK_AMOUNTS.map((ml) => (
            <Button
              key={ml}
              variant="outline"
              className="flex-1 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
              onClick={() => addEntry(ml)}
              disabled={loading}
            >
              {ml}ml
            </Button>
          ))}
        </div>
        <form onSubmit={handleSubmit(onCustomSubmit)} className="flex gap-2">
          <div className="flex-1">
            <Input
              type="number"
              placeholder="Custom ml"
              {...register("amount", { valueAsNumber: true })}
            />
            {errors.amount && (
              <p className="text-xs text-destructive mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>
          <Button type="submit" disabled={loading}>
            Add
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
