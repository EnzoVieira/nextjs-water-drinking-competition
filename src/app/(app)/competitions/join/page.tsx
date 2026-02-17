"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { joinCompetitionSchema, type JoinCompetitionValues } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function JoinCompetitionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JoinCompetitionValues>({
    resolver: zodResolver(joinCompetitionSchema),
    defaultValues: {
      code: searchParams.get("code") ?? "",
    },
  });

  async function onSubmit(data: JoinCompetitionValues) {
    setServerError("");

    const res = await fetch("/api/competitions/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const result = await res.json();
      router.push(`/competitions/${result.competitionId}`);
    } else {
      const result = await res.json();
      setServerError(result.error || "Failed to join");
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Join Competition</h1>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Invite Code</Label>
              <Input
                id="code"
                placeholder="Enter invite code"
                autoFocus
                {...register("code")}
              />
              {errors.code && (
                <p className="text-sm text-destructive">
                  {errors.code.message}
                </p>
              )}
            </div>
            {serverError && (
              <p className="text-sm text-destructive">{serverError}</p>
            )}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Joining..." : "Join Competition"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
