import { differenceInCalendarDays } from "date-fns";

export interface UserScore {
  userId: string;
  userName: string;
  userImage: string | null;
  totalMl: number;
  longestStreak: number;
  volumeScore: number;
  streakScore: number;
  combinedScore: number;
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

export function calculateScore(totalMl: number, longestStreak: number): {
  volumeScore: number;
  streakScore: number;
  combinedScore: number;
} {
  const volumeScore = Math.round((totalMl / 1000) * 10) / 10;
  const streakScore = longestStreak * 2;
  const combinedScore = Math.round((volumeScore + streakScore) * 10) / 10;
  return { volumeScore, streakScore, combinedScore };
}
