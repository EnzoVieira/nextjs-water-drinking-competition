"use client";

import { Button } from "@/components/ui/button";

interface CountInputProps {
  unit: string;
  todayCount: number;
  loading: boolean;
  onAdd: () => void;
}

export function CountInput({ unit, todayCount, loading, onAdd }: CountInputProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">Today</p>
        <p className="text-2xl font-bold">
          {todayCount} <span className="text-base font-normal text-muted-foreground">{unit}</span>
        </p>
      </div>
      <Button onClick={onAdd} disabled={loading} size="lg">
        + Add
      </Button>
    </div>
  );
}
