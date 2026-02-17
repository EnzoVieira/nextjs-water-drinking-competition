import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CompetitionCard } from "@/components/competition-card";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const memberships = await prisma.competitionMember.findMany({
    where: { userId: user.id },
    include: {
      competition: {
        include: {
          _count: { select: { members: true } },
        },
      },
    },
    orderBy: { competition: { startDate: "desc" } },
  });

  // Calculate user rank for each competition
  const competitionsWithRank = await Promise.all(
    memberships.map(async (m) => {
      const entries = await prisma.waterEntry.groupBy({
        by: ["userId"],
        where: { competitionId: m.competitionId },
        _sum: { amount: true },
        orderBy: { _sum: { amount: "desc" } },
      });

      const rankIndex = entries.findIndex((e) => e.userId === user.id);

      return {
        id: m.competition.id,
        name: m.competition.name,
        startDate: m.competition.startDate.toISOString(),
        endDate: m.competition.endDate.toISOString(),
        memberCount: m.competition._count.members,
        userRank: rankIndex >= 0 ? rankIndex + 1 : null,
      };
    })
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Competitions</h1>
        <div className="flex gap-2">
          <Link
            href="/competitions/join"
            className="border border-gray-300 rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Join
          </Link>
          <Link
            href="/competitions/new"
            className="bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Create
          </Link>
        </div>
      </div>

      {competitionsWithRank.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">
            You haven&apos;t joined any competitions yet.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/competitions/join"
              className="border border-gray-300 rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Join with Code
            </Link>
            <Link
              href="/competitions/new"
              className="bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-700"
            >
              Create One
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {competitionsWithRank.map((comp) => (
            <CompetitionCard key={comp.id} {...comp} />
          ))}
        </div>
      )}
    </div>
  );
}
