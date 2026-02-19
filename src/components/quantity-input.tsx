"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { quantityEntrySchema, type QuantityEntryValues } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface QuantityInputProps {
  unit: string;
  loading: boolean;
  onAdd: (amount: number) => void;
}

export function QuantityInput({ unit, loading, onAdd }: QuantityInputProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuantityEntryValues>({
    resolver: zodResolver(quantityEntrySchema),
  });

  function onSubmit(data: QuantityEntryValues) {
    onAdd(data.amount);
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="flex gap-2 items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Amount"
              {...register("amount", { valueAsNumber: true })}
            />
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {unit}
            </span>
          </div>
          {errors.amount && (
            <p className="text-xs text-destructive mt-1">
              {errors.amount.message}
            </p>
          )}
        </div>
        <Button type="submit" disabled={loading}>
          Save
        </Button>
      </div>
    </form>
  );
}
