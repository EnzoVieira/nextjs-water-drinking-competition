import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { calculateStreak, calculateScore, type UserScore } from "@/lib/scoring";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ competitionId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { competitionId } = await params;

  const members = await prisma.competitionMember.findMany({
    where: { competitionId },
    include: { user: { select: { id: true, name: true, image: true } } },
  });

  const scores: UserScore[] = await Promise.all(
    members.map(async (member) => {
      const entries = await prisma.waterEntry.findMany({
        where: { competitionId, userId: member.userId },
        select: { amount: true, date: true },
      });

      const totalMl = entries.reduce((sum, e) => sum + e.amount, 0);
      const longestStreak = calculateStreak(entries.map((e) => e.date));
      const { volumeScore, streakScore, combinedScore } = calculateScore(totalMl, longestStreak);

      return {
        userId: member.user.id,
        userName: member.user.name,
        userImage: member.user.image,
        totalMl,
        longestStreak,
        volumeScore,
        streakScore,
        combinedScore,
      };
    })
  );

  scores.sort((a, b) => b.combinedScore - a.combinedScore);

  return NextResponse.json(scores);
}
