import { differenceInCalendarDays } from "date-fns";

export type RankingMethod = "TOTAL" | "CONSISTENCY" | "COMBINED";

export interface UserScore {
  userId: string;
  userName: string;
  userImage: string | null;
  totalAmount: number;
  longestStreak: number;
  totalScore: number;
  streakScore: number;
  combinedScore: number;
  rankScore: number;
}

export function calculateStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;

  const unique = [
    ...new Set(dates.map((d) => d.toISOString().split("T")[0])),
  ]
    .sort()
    .map((s) => new Date(s));

  let longest = 1;
  let current = 1;

  for (let i = 1; i < unique.length; i++) {
    if (differenceInCalendarDays(unique[i], unique[i - 1]) === 1) {
      current++;
      if (current > longest) longest = current;
    } else {
      current = 1;
    }
  }

  return longest;
}

export function calculateScore(
  totalAmount: number,
  longestStreak: number,
  rankingMethod: RankingMethod
): {
  totalScore: number;
  streakScore: number;
  combinedScore: number;
  rankScore: number;
} {
  const totalScore = totalAmount;
  const streakScore = longestStreak * 2;
  const combinedScore = Math.round((totalScore + streakScore) * 10) / 10;

  let rankScore: number;
  switch (rankingMethod) {
    case "TOTAL":
      rankScore = totalScore;
      break;
    case "CONSISTENCY":
      rankScore = streakScore;
      break;
    case "COMBINED":
      rankScore = combinedScore;
      break;
  }

  return { totalScore, streakScore, combinedScore, rankScore };
}
