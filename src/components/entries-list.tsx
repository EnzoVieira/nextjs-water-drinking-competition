"use client";

import { format } from "date-fns";
import { X } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Entry {
  id: string;
  amount: number;
  createdAt: string;
}

interface EntriesListProps {
  entries: Entry[];
  competitionId: string;
  metricType: "QUANTITY" | "COUNT" | "CHECK";
  unit: string | null;
  onEntryDeleted: () => void;
}

export function EntriesList({
  entries,
  competitionId,
  metricType,
  unit,
  onEntryDeleted,
}: EntriesListProps) {
  const total = entries.reduce((sum, e) => sum + e.amount, 0);

  function formatTotal() {
    if (metricType === "CHECK") return entries.length > 0 ? "Completed" : "";
    return `${total} ${unit || ""} total`;
  }

  function formatEntry(entry: Entry) {
    if (metricType === "CHECK") return "Completed";
    return `${entry.amount} ${unit || ""}`;
  }

  async function handleDelete(entryId: string) {
    const res = await fetch(
      `/api/competitions/${competitionId}/entries/${entryId}`,
      { method: "DELETE" }
    );
    if (res.ok) {
      onEntryDeleted();
      toast.success("Entry deleted");
    } else {
      toast.error("Failed to delete entry");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today&apos;s Entries</CardTitle>
        <CardAction>
          <span className="text-sm font-medium text-primary">
            {formatTotal()}
          </span>
        </CardAction>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No entries yet today. Start logging!
          </p>
        ) : (
          <ul className="space-y-2">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">
                    {format(new Date(entry.createdAt), "HH:mm")}
                  </span>
                  <span className="font-medium">{formatEntry(entry)}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => handleDelete(entry.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
