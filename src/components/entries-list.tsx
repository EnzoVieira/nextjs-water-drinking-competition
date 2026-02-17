"use client";

import { format } from "date-fns";

interface Entry {
  id: string;
  amount: number;
  createdAt: string;
}

interface EntriesListProps {
  entries: Entry[];
  competitionId: string;
  onEntryDeleted: () => void;
}

export function EntriesList({ entries, competitionId, onEntryDeleted }: EntriesListProps) {
  const total = entries.reduce((sum, e) => sum + e.amount, 0);

  async function handleDelete(entryId: string) {
    const res = await fetch(
      `/api/competitions/${competitionId}/entries/${entryId}`,
      { method: "DELETE" }
    );
    if (res.ok) onEntryDeleted();
  }

  return (
    <div className="bg-white rounded-lg shadow p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Today&apos;s Entries</h3>
        <span className="text-sm font-medium text-blue-600">{total}ml total</span>
      </div>
      {entries.length === 0 ? (
        <p className="text-sm text-gray-500">No entries yet today. Start logging!</p>
      ) : (
        <ul className="space-y-2">
          {entries.map((entry) => (
            <li key={entry.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <span className="text-gray-400">
                  {format(new Date(entry.createdAt), "HH:mm")}
                </span>
                <span className="font-medium">{entry.amount}ml</span>
              </div>
              <button
                onClick={() => handleDelete(entry.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
