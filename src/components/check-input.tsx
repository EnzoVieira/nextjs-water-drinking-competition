"use client";

import { Button } from "@/components/ui/button";

interface CheckInputProps {
  completed: boolean;
  loading: boolean;
  onMark: () => void;
}

export function CheckInput({ completed, loading, onMark }: CheckInputProps) {
  if (completed) {
    return (
      <div className="flex items-center justify-center gap-2 py-2 text-green-600 dark:text-green-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            clipRule="evenodd"
          />
        </svg>
        <span className="font-medium">Completed today</span>
      </div>
    );
  }

  return (
    <Button onClick={onMark} disabled={loading} className="w-full" size="lg">
      Mark as completed
    </Button>
  );
}
