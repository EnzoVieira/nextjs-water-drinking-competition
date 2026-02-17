import { NextResponse } from "next/server";
import { startOfMonth, endOfMonth } from "date-fns";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ competitionId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { competitionId } = await params;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || user.id;
  const month = searchParams.get("month"); // YYYY-MM format

  const refDate = month ? new Date(`${month}-01`) : new Date();
  const start = startOfMonth(refDate);
  const end = endOfMonth(refDate);

  const entries = await prisma.waterEntry.findMany({
    where: {
      competitionId,
      userId,
      date: { gte: start, lte: end },
    },
    select: { date: true, amount: true },
  });

  const dailyTotals: Record<string, number> = {};
  for (const entry of entries) {
    const key = entry.date.toISOString().split("T")[0];
    dailyTotals[key] = (dailyTotals[key] || 0) + entry.amount;
  }

  const result = Object.entries(dailyTotals).map(([date, totalMl]) => ({
    date,
    totalMl,
  }));

  return NextResponse.json(result);
}
