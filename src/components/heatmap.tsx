"use client";

import { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  getDay,
  eachDayOfInterval,
  addMonths,
  subMonths,
} from "date-fns";

interface HeatmapProps {
  competitionId: string;
}

interface DayData {
  date: string;
  totalMl: number;
}

function getIntensityClass(ml: number): string {
  if (ml === 0) return "bg-gray-100";
  if (ml <= 500) return "bg-blue-200";
  if (ml <= 1000) return "bg-blue-400";
  if (ml <= 2000) return "bg-blue-600";
  return "bg-blue-800";
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function Heatmap({ competitionId }: HeatmapProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [data, setData] = useState<DayData[]>([]);
  const [tooltip, setTooltip] = useState<{ date: string; ml: number; x: number; y: number } | null>(null);

  useEffect(() => {
    const monthStr = format(currentMonth, "yyyy-MM");
    fetch(`/api/competitions/${competitionId}/heatmap?month=${monthStr}`)
      .then((r) => r.json())
      .then(setData);
  }, [competitionId, currentMonth]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startOffset = getDay(monthStart); // 0=Sun

  const dataMap = new Map(data.map((d) => [d.date, d.totalMl]));

  return (
    <div className="bg-white rounded-lg shadow p-5">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
          className="text-gray-500 hover:text-gray-700 px-2 py-1"
        >
          &larr;
        </button>
        <h3 className="font-semibold">{format(currentMonth, "MMMM yyyy")}</h3>
        <button
          onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
          className="text-gray-500 hover:text-gray-700 px-2 py-1"
        >
          &rarr;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs text-center mb-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-gray-400 py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 relative">
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const ml = dataMap.get(dateStr) || 0;
          return (
            <div
              key={dateStr}
              className={`aspect-square rounded-sm ${getIntensityClass(ml)} cursor-pointer`}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltip({ date: dateStr, ml, x: rect.left, y: rect.top });
              }}
              onMouseLeave={() => setTooltip(null)}
            />
          );
        })}
      </div>

      {tooltip && (
        <div className="mt-2 text-xs text-center text-gray-600">
          {format(new Date(tooltip.date), "MMM d")} &mdash; {tooltip.ml}ml
        </div>
      )}

      <div className="flex items-center justify-end gap-1 mt-3 text-xs text-gray-400">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-gray-100" />
        <div className="w-3 h-3 rounded-sm bg-blue-200" />
        <div className="w-3 h-3 rounded-sm bg-blue-400" />
        <div className="w-3 h-3 rounded-sm bg-blue-600" />
        <div className="w-3 h-3 rounded-sm bg-blue-800" />
        <span>More</span>
      </div>
    </div>
  );
}
