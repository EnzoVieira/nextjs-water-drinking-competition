import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ competitionId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { competitionId } = await params;

  const membership = await prisma.competitionMember.findUnique({
    where: { userId_competitionId: { userId: user.id, competitionId } },
  });

  if (!membership) {
    return NextResponse.json({ error: "Not a member" }, { status: 403 });
  }

  const competition = await prisma.competition.findUnique({
    where: { id: competitionId },
    include: {
      _count: { select: { members: true } },
      createdBy: { select: { name: true } },
    },
  });

  if (!competition) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...competition,
    memberCount: competition._count.members,
  });
}
