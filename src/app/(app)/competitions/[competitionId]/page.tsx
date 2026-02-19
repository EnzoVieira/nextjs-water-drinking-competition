"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { EntryInput } from "@/components/entry-input";
import { EntriesList } from "@/components/entries-list";
import { Heatmap } from "@/components/heatmap";
import { Leaderboard } from "@/components/leaderboard";
import { InviteShare } from "@/components/invite-share";
import type { UserScore } from "@/lib/scoring";

interface Competition {
  id: string;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  inviteCode: string;
  memberCount: number;
  metricType: "QUANTITY" | "COUNT" | "CHECK";
  unit: string | null;
  rankingMethod: "TOTAL" | "CONSISTENCY" | "COMBINED";
  createdBy: { name: string };
}

interface Entry {
  id: string;
  amount: number;
  createdAt: string;
}

export default function CompetitionDetailPage() {
  const { competitionId } = useParams<{ competitionId: string }>();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [scores, setScores] = useState<UserScore[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  const fetchData = useCallback(async () => {
    const [compRes, entriesRes, leaderboardRes] = await Promise.all([
      fetch(`/api/competitions/${competitionId}`),
      fetch(`/api/competitions/${competitionId}/entries?date=${today}`),
      fetch(`/api/competitions/${competitionId}/leaderboard`),
    ]);

    if (compRes.ok) {
      setCompetition(await compRes.json());
    }
    if (entriesRes.ok) {
      setEntries(await entriesRes.json());
    }
    if (leaderboardRes.ok) {
      setScores(await leaderboardRes.json());
    }
    setLoading(false);
  }, [competitionId, today]);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.id) setCurrentUserId(data.id);
      })
      .catch(() => {});
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="text-center py-12 text-muted-foreground">Loading...</div>
    );
  }

  if (!competition) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Competition not found or you are not a member.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{competition.name}</h1>
        {competition.description && (
          <p className="text-muted-foreground mt-1">
            {competition.description}
          </p>
        )}
        <p className="text-sm text-muted-foreground mt-1">
          {format(new Date(competition.startDate), "MMM d")} &ndash;{" "}
          {format(new Date(competition.endDate), "MMM d, yyyy")} &middot;{" "}
          {competition.memberCount} members &middot; Created by{" "}
          {competition.createdBy.name}
        </p>
      </div>

      <EntryInput
        competitionId={competitionId}
        metricType={competition.metricType}
        unit={competition.unit}
        todayEntries={entries}
        onEntryAdded={fetchData}
      />

      <EntriesList
        entries={entries}
        competitionId={competitionId}
        metricType={competition.metricType}
        unit={competition.unit}
        onEntryDeleted={fetchData}
      />

      <Heatmap
        competitionId={competitionId}
        metricType={competition.metricType}
        unit={competition.unit}
      />

      <Leaderboard
        scores={scores}
        currentUserId={currentUserId}
        metricType={competition.metricType}
        unit={competition.unit}
        rankingMethod={competition.rankingMethod}
      />

      <InviteShare inviteCode={competition.inviteCode} />
    </div>
  );
}
