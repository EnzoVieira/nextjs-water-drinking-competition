"use client";

import { useState } from "react";

interface WaterInputProps {
  competitionId: string;
  onEntryAdded: () => void;
}

const QUICK_AMOUNTS = [200, 300, 500];

export function WaterInput({ competitionId, onEntryAdded }: WaterInputProps) {
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);

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
      setCustom("");
      onEntryAdded();
    }
    setLoading(false);
  }

  function handleCustomSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amount = parseInt(custom);
    if (amount > 0) addEntry(amount);
  }

  return (
    <div className="bg-white rounded-lg shadow p-5">
      <h3 className="font-semibold mb-3">Log Water</h3>
      <div className="flex gap-2 mb-3">
        {QUICK_AMOUNTS.map((ml) => (
          <button
            key={ml}
            onClick={() => addEntry(ml)}
            disabled={loading}
            className="flex-1 border border-blue-200 bg-blue-50 text-blue-700 rounded-md py-2 text-sm font-medium hover:bg-blue-100 transition-colors disabled:opacity-50"
          >
            {ml}ml
          </button>
        ))}
      </div>
      <form onSubmit={handleCustomSubmit} className="flex gap-2">
        <input
          type="number"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="Custom ml"
          min="1"
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading || !custom}
          className="bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          Add
        </button>
      </form>
    </div>
  );
}
