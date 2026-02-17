import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { code } = await request.json();
  if (!code?.trim()) {
    return NextResponse.json({ error: "Invite code is required" }, { status: 400 });
  }

  const competition = await prisma.competition.findUnique({
    where: { inviteCode: code.trim() },
  });

  if (!competition) {
    return NextResponse.json({ error: "Invalid invite code" }, { status: 404 });
  }

  const existing = await prisma.competitionMember.findUnique({
    where: {
      userId_competitionId: { userId: user.id, competitionId: competition.id },
    },
  });

  if (existing) {
    return NextResponse.json({ competitionId: competition.id, alreadyMember: true });
  }

  await prisma.competitionMember.create({
    data: { userId: user.id, competitionId: competition.id },
  });

  return NextResponse.json({ competitionId: competition.id, alreadyMember: false }, { status: 201 });
}
