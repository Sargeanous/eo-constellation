"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3">
      <p className="text-destructive">{error.message}</p>
      <button
        onClick={reset}
        className="rounded-md border border-border px-4 py-2 text-sm hover:bg-muted"
      >
        Retry
      </button>
    </div>
  );
}
