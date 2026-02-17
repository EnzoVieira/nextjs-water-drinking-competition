"use client";

import { useState } from "react";

interface InviteShareProps {
  inviteCode: string;
}

export function InviteShare({ inviteCode }: InviteShareProps) {
  const [copied, setCopied] = useState<"code" | "link" | null>(null);

  const inviteLink = `${typeof window !== "undefined" ? window.location.origin : ""}/competitions/join?code=${inviteCode}`;

  function copyToClipboard(text: string, type: "code" | "link") {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="bg-white rounded-lg shadow p-5">
      <h3 className="font-semibold mb-3">Invite Others</h3>
      <div className="flex items-center gap-2 mb-3">
        <code className="bg-gray-100 px-3 py-1.5 rounded text-sm font-mono flex-1">
          {inviteCode}
        </code>
        <button
          onClick={() => copyToClipboard(inviteCode, "code")}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm hover:bg-gray-50 transition-colors"
        >
          {copied === "code" ? "Copied!" : "Copy Code"}
        </button>
      </div>
      <button
        onClick={() => copyToClipboard(inviteLink, "link")}
        className="text-sm text-blue-600 hover:text-blue-700"
      >
        {copied === "link" ? "Link Copied!" : "Copy Invite Link"}
      </button>
    </div>
  );
}
