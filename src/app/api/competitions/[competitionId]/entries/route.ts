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

  const entries = await prisma.waterEntry.findMany({
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

  const body = await request.json();
  const { amount, date } = body;

  if (!amount || amount <= 0) {
    return NextResponse.json({ error: "Amount must be positive" }, { status: 400 });
  }

  const entry = await prisma.waterEntry.create({
    data: {
      amount: Math.round(amount),
      date: new Date(date || new Date().toISOString().split("T")[0]),
      userId: user.id,
      competitionId,
    },
  });

  return NextResponse.json(entry, { status: 201 });
}
