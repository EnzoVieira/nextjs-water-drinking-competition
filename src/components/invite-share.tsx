"use client";

import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface InviteShareProps {
  inviteCode: string;
}

export function InviteShare({ inviteCode }: InviteShareProps) {
  const inviteLink = `${typeof window !== "undefined" ? window.location.origin : ""}/competitions/join?code=${inviteCode}`;

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Others</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <code className="bg-muted px-3 py-1.5 rounded text-sm font-mono flex-1">
            {inviteCode}
          </code>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(inviteCode, "Code")}
          >
            Copy Code
          </Button>
        </div>
        <Button
          variant="link"
          className="h-auto p-0"
          onClick={() => copyToClipboard(inviteLink, "Link")}
        >
          Copy Invite Link
        </Button>
      </CardContent>
    </Card>
  );
}
