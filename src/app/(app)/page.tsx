import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { CompetitionCard } from "@/components/competition-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
          <Button variant="outline" asChild>
            <Link href="/competitions/join">Join</Link>
          </Button>
          <Button asChild>
            <Link href="/competitions/new">Create</Link>
          </Button>
        </div>
      </div>

      {competitionsWithRank.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              You haven&apos;t joined any competitions yet.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" asChild>
                <Link href="/competitions/join">Join with Code</Link>
              </Button>
              <Button asChild>
                <Link href="/competitions/new">Create One</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
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
