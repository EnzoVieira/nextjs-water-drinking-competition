"use client";

import type { UserScore } from "@/lib/scoring";

interface LeaderboardProps {
  scores: UserScore[];
  currentUserId: string;
}

export function Leaderboard({ scores, currentUserId }: LeaderboardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-5">
      <h3 className="font-semibold mb-3">Leaderboard</h3>
      {scores.length === 0 ? (
        <p className="text-sm text-gray-500">No participants yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2 pr-2">#</th>
                <th className="pb-2 pr-2">Name</th>
                <th className="pb-2 pr-2 text-right">Volume</th>
                <th className="pb-2 pr-2 text-right">Streak</th>
                <th className="pb-2 text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, i) => (
                <tr
                  key={score.userId}
                  className={
                    score.userId === currentUserId
                      ? "bg-blue-50 font-medium"
                      : ""
                  }
                >
                  <td className="py-2 pr-2">{i + 1}</td>
                  <td className="py-2 pr-2">{score.userName}</td>
                  <td className="py-2 pr-2 text-right">
                    {(score.totalMl / 1000).toFixed(1)}L
                  </td>
                  <td className="py-2 pr-2 text-right">
                    {score.longestStreak}d
                  </td>
                  <td className="py-2 text-right">{score.combinedScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
