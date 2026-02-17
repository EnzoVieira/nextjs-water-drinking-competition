"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CompetitionCardProps {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  memberCount: number;
  userRank: number | null;
}

export function CompetitionCard({
  id,
  name,
  startDate,
  endDate,
  memberCount,
  userRank,
}: CompetitionCardProps) {
  return (
    <Link href={`/competitions/${id}`} className="block">
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg">{name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            {format(new Date(startDate), "MMM d")} &ndash;{" "}
            {format(new Date(endDate), "MMM d, yyyy")}
          </p>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">
              {memberCount} {memberCount === 1 ? "member" : "members"}
            </span>
            {userRank !== null && (
              <Badge variant="secondary">Rank #{userRank}</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
