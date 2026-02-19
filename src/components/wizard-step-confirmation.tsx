"use client";

import Link from "next/link";
import { useCompetitionWizardStore } from "@/lib/stores/competition-wizard-store";
import { InviteShare } from "@/components/invite-share";
import { Button } from "@/components/ui/button";

export function WizardStepConfirmation() {
  const { createdCompetitionId, createdInviteCode, reset } =
    useCompetitionWizardStore();

  if (!createdCompetitionId || !createdInviteCode) return null;

  return (
    <div className="space-y-6 text-center">
      <div>
        <h2 className="text-xl font-semibold">Competition created!</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Share the invite code with others so they can join.
        </p>
      </div>

      <InviteShare inviteCode={createdInviteCode} />

      <Button asChild className="w-full" onClick={reset}>
        <Link href={`/competitions/${createdCompetitionId}`}>
          Go to Competition
        </Link>
      </Button>
    </div>
  );
}
