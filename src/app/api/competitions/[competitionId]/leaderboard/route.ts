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

  const competition = await prisma.competition.findUnique({
    where: { id: competitionId },
    select: { rankingMethod: true, metricType: true },
  });

  if (!competition) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const members = await prisma.competitionMember.findMany({
    where: { competitionId },
    include: { user: { select: { id: true, name: true, image: true } } },
  });

  const scores: UserScore[] = await Promise.all(
    members.map(async (member) => {
      const entries = await prisma.entry.findMany({
        where: { competitionId, userId: member.userId },
        select: { amount: true, date: true },
      });

      const totalAmount = entries.reduce((sum, e) => sum + e.amount, 0);
      const longestStreak = calculateStreak(entries.map((e) => e.date));
      const { totalScore, streakScore, combinedScore, rankScore } = calculateScore(
        totalAmount,
        longestStreak,
        competition.rankingMethod
      );

      return {
        userId: member.user.id,
        userName: member.user.name,
        userImage: member.user.image,
        totalAmount,
        longestStreak,
        totalScore,
        streakScore,
        combinedScore,
        rankScore,
      };
    })
  );

  scores.sort((a, b) => b.rankScore - a.rankScore);

  return NextResponse.json(scores);
}
