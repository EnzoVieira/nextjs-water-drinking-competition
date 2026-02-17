import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const memberships = await prisma.competitionMember.findMany({
    where: { userId: user.id },
    include: {
      competition: {
        include: { _count: { select: { members: true } } },
      },
    },
    orderBy: { competition: { startDate: "desc" } },
  });

  const competitions = memberships.map((m) => ({
    ...m.competition,
    memberCount: m.competition._count.members,
  }));

  return NextResponse.json(competitions);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { name, description, startDate, endDate } = body;

  if (!name || !startDate || !endDate) {
    return NextResponse.json({ error: "Name, start date, and end date are required" }, { status: 400 });
  }

  const competition = await prisma.competition.create({
    data: {
      name,
      description: description || null,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      inviteCode: nanoid(8),
      createdById: user.id,
      members: {
        create: { userId: user.id },
      },
    },
  });

  return NextResponse.json(competition, { status: 201 });
}
