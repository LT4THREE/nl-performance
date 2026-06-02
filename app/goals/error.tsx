"use client";

import { useEffect } from "react";

export default function GoalsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Goals page error:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">
        Couldn&apos;t load the goals page
      </h1>
      <p className="text-[var(--color-muted)] leading-relaxed">
        Something went wrong fetching or filtering goals on the server. The team has been
        notified.
      </p>
      <details className="text-sm text-[var(--color-muted)] mt-4">
        <summary className="cursor-pointer">Technical detail</summary>
        <pre className="mt-2 p-3 bg-[var(--color-surface)] rounded-md text-xs overflow-x-auto">
          {error.message}
          {error.digest ? `\nDigest: ${error.digest}` : ""}
        </pre>
      </details>
      <button
        type="button"
        onClick={reset}
        className="px-4 py-2 rounded-md bg-[var(--color-accent)] text-[var(--color-accent-fg)] text-sm font-medium hover:bg-[var(--color-accent-strong)] transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
