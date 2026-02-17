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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface HeatmapProps {
  competitionId: string;
}

interface DayData {
  date: string;
  totalMl: number;
}

function getIntensityClass(ml: number): string {
  if (ml === 0) return "bg-muted";
  if (ml <= 500) return "bg-blue-200 dark:bg-blue-900";
  if (ml <= 1000) return "bg-blue-400 dark:bg-blue-700";
  if (ml <= 2000) return "bg-blue-600 dark:bg-blue-500";
  return "bg-blue-800 dark:bg-blue-300";
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function Heatmap({ competitionId }: HeatmapProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [data, setData] = useState<DayData[]>([]);
  const [tooltip, setTooltip] = useState<{
    date: string;
    ml: number;
  } | null>(null);

  useEffect(() => {
    const monthStr = format(currentMonth, "yyyy-MM");
    fetch(`/api/competitions/${competitionId}/heatmap?month=${monthStr}`)
      .then((r) => r.json())
      .then(setData);
  }, [competitionId, currentMonth]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startOffset = getDay(monthStart);

  const dataMap = new Map(data.map((d) => [d.date, d.totalMl]));

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
        >
          <ChevronLeft />
        </Button>
        <CardTitle>{format(currentMonth, "MMMM yyyy")}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
        >
          <ChevronRight />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-xs text-center mb-1">
          {WEEKDAYS.map((d) => (
            <div key={d} className="text-muted-foreground py-1">
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
                onMouseEnter={() => setTooltip({ date: dateStr, ml })}
                onMouseLeave={() => setTooltip(null)}
              />
            );
          })}
        </div>

        {tooltip && (
          <div className="mt-2 text-xs text-center text-muted-foreground">
            {format(new Date(tooltip.date), "MMM d")} &mdash; {tooltip.ml}ml
          </div>
        )}

        <div className="flex items-center justify-end gap-1 mt-3 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-muted" />
          <div className="w-3 h-3 rounded-sm bg-blue-200 dark:bg-blue-900" />
          <div className="w-3 h-3 rounded-sm bg-blue-400 dark:bg-blue-700" />
          <div className="w-3 h-3 rounded-sm bg-blue-600 dark:bg-blue-500" />
          <div className="w-3 h-3 rounded-sm bg-blue-800 dark:bg-blue-300" />
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
