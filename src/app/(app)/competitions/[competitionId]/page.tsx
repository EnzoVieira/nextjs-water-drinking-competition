"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { WaterInput } from "@/components/water-input";
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
      <div className="text-center py-12 text-gray-500">Loading...</div>
    );
  }

  if (!competition) {
    return (
      <div className="text-center py-12 text-gray-500">
        Competition not found or you are not a member.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{competition.name}</h1>
        {competition.description && (
          <p className="text-gray-600 mt-1">{competition.description}</p>
        )}
        <p className="text-sm text-gray-500 mt-1">
          {format(new Date(competition.startDate), "MMM d")} &ndash;{" "}
          {format(new Date(competition.endDate), "MMM d, yyyy")} &middot;{" "}
          {competition.memberCount} members &middot; Created by{" "}
          {competition.createdBy.name}
        </p>
      </div>

      <WaterInput competitionId={competitionId} onEntryAdded={fetchData} />

      <EntriesList
        entries={entries}
        competitionId={competitionId}
        onEntryDeleted={fetchData}
      />

      <Heatmap competitionId={competitionId} />

      <Leaderboard scores={scores} currentUserId={currentUserId} />

      <InviteShare inviteCode={competition.inviteCode} />
    </div>
  );
}
