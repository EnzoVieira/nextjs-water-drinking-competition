import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ competitionId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { competitionId } = await params;
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  const where: Record<string, unknown> = {
    competitionId,
    userId: user.id,
  };

  if (date) {
    where.date = new Date(date);
  }

  const entries = await prisma.entry.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(entries);
}

export async function POST(
  request: Request,
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
    select: { metricType: true },
  });

  if (!competition) {
    return NextResponse.json({ error: "Competition not found" }, { status: 404 });
  }

  const body = await request.json();
  const date = new Date(body.date || new Date().toISOString().split("T")[0]);

  let amount: number;

  switch (competition.metricType) {
    case "QUANTITY": {
      amount = Math.round(body.amount);
      if (!amount || amount <= 0) {
        return NextResponse.json({ error: "Amount must be positive" }, { status: 400 });
      }
      break;
    }
    case "COUNT": {
      amount = 1;
      break;
    }
    case "CHECK": {
      const existing = await prisma.entry.findFirst({
        where: { competitionId, userId: user.id, date },
      });
      if (existing) {
        return NextResponse.json({ error: "Already completed for this date" }, { status: 400 });
      }
      amount = 1;
      break;
    }
  }

  const entry = await prisma.entry.create({
    data: {
      amount,
      date,
      userId: user.id,
      competitionId,
    },
  });

  return NextResponse.json(entry, { status: 201 });
}
