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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface LeaderboardProps {
  scores: UserScore[];
  currentUserId: string;
  metricType: "QUANTITY" | "COUNT" | "CHECK";
  unit: string | null;
  rankingMethod: "TOTAL" | "CONSISTENCY" | "COMBINED";
}

function formatTotal(totalAmount: number, metricType: string, unit: string | null) {
  if (metricType === "CHECK") return `${totalAmount} days`;
  return `${totalAmount} ${unit || ""}`;
}

export function Leaderboard({
  scores,
  currentUserId,
  metricType,
  unit,
  rankingMethod,
}: LeaderboardProps) {
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
                {(rankingMethod === "TOTAL" || rankingMethod === "COMBINED") && (
                  <TableHead className="text-right">Total</TableHead>
                )}
                {(rankingMethod === "CONSISTENCY" || rankingMethod === "COMBINED") && (
                  <TableHead className="text-right">Streak</TableHead>
                )}
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
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar size="sm">
                        {score.userImage && (
                          <AvatarImage src={score.userImage} alt={score.userName} />
                        )}
                        <AvatarFallback>{getInitials(score.userName)}</AvatarFallback>
                      </Avatar>
                      {score.userName}
                    </div>
                  </TableCell>
                  {(rankingMethod === "TOTAL" || rankingMethod === "COMBINED") && (
                    <TableCell className="text-right">
                      {formatTotal(score.totalAmount, metricType, unit)}
                    </TableCell>
                  )}
                  {(rankingMethod === "CONSISTENCY" || rankingMethod === "COMBINED") && (
                    <TableCell className="text-right">
                      {score.longestStreak}d
                    </TableCell>
                  )}
                  <TableCell className="text-right">
                    {score.rankScore}
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
