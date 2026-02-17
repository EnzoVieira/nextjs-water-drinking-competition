"use client";

import type { UserScore } from "@/lib/scoring";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface LeaderboardProps {
  scores: UserScore[];
  currentUserId: string;
}

export function Leaderboard({ scores, currentUserId }: LeaderboardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        {scores.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No participants yet.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Volume</TableHead>
                <TableHead className="text-right">Streak</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scores.map((score, i) => (
                <TableRow
                  key={score.userId}
                  className={cn(
                    score.userId === currentUserId &&
                      "bg-primary/10 font-medium"
                  )}
                >
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{score.userName}</TableCell>
                  <TableCell className="text-right">
                    {(score.totalMl / 1000).toFixed(1)}L
                  </TableCell>
                  <TableCell className="text-right">
                    {score.longestStreak}d
                  </TableCell>
                  <TableCell className="text-right">
                    {score.combinedScore}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
