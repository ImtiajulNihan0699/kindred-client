"use client";

import { useEffect } from "react";
import Link from "next/link";
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Something went wrong
            </h1>
            <p className="text-muted-foreground">
              We&apos;re sorry, but a critical error occurred.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => reset()}
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                Try again
              </button>
              <Link href="/">Go Home</Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
