"use client";

import Link from "next/link";
import { format } from "date-fns";

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
    <Link
      href={`/competitions/${id}`}
      className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-5"
    >
      <h3 className="font-semibold text-lg mb-1">{name}</h3>
      <p className="text-sm text-gray-500 mb-3">
        {format(new Date(startDate), "MMM d")} &ndash;{" "}
        {format(new Date(endDate), "MMM d, yyyy")}
      </p>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-gray-600">
          {memberCount} {memberCount === 1 ? "member" : "members"}
        </span>
        {userRank !== null && (
          <span className="text-blue-600 font-medium">Rank #{userRank}</span>
        )}
      </div>
    </Link>
  );
}
