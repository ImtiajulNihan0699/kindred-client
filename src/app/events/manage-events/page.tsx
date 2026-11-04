"use client";

import { useCallback, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import EventCard, { type Event } from "@/components/events/EventCard";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const ManageEventsPage = () => {
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const userId = user?.id;

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUserEvents = useCallback(async () => {
    if (!userId) return;

    try {
      const res = await fetch(
        `http://localhost:8000/events/user/${userId}`,
        { cache: "no-store" },
      );

      if (!res.ok) {
        throw new Error("Failed to fetch your events");
      }

      const data: Event[] = await res.json();

      setEvents(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load your events.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (isPending || !userId) return;

    let ignore = false;

    const loadUserEvents = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/events/user/${userId}`,
          { cache: "no-store" },
        );

        if (!res.ok) {
          throw new Error("Failed to fetch your events");
        }

        const data: Event[] = await res.json();

        if (!ignore) {
          setEvents(data);
          setError("");
        }
      } catch (err) {
        console.error(err);

        if (!ignore) {
          setError("Unable to load your events.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadUserEvents();

    return () => {
      ignore = true;
    };
  }, [userId, isPending]);

  const handleRetry = async () => {
    setLoading(true);
    setError("");
    await fetchUserEvents();
  };

  if (isPending) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-5 w-64" />
          </div>

          <Skeleton className="h-9 w-36" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-border bg-card"
            >
              <Skeleton className="h-52 w-full rounded-none" />

              <div className="space-y-3 p-5">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-6 w-3/4" />

                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-28" />
                </div>

                <Skeleton className="h-16 w-full" />

                <div className="flex gap-2">
                  <Skeleton className="h-9 flex-1" />
                  <Skeleton className="h-9 flex-1" />
                  <Skeleton className="h-9 flex-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12 text-center">
        <h1 className="text-2xl font-bold">Please sign in</h1>

        <p className="mt-2 text-muted-foreground">
          You need to sign in to manage your events.
        </p>

        <Link href="/signin" className="mt-5 inline-block">
          <Button>Sign In</Button>
        </Link>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-5 w-64" />
          </div>

          <Skeleton className="h-9 w-36" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-border bg-card"
            >
              <Skeleton className="h-52 w-full rounded-none" />

              <div className="space-y-3 p-5">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-6 w-3/4" />

                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-28" />
                </div>

                <Skeleton className="h-16 w-full" />

                <div className="flex gap-2">
                  <Skeleton className="h-9 flex-1" />
                  <Skeleton className="h-9 flex-1" />
                  <Skeleton className="h-9 flex-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Events</h1>

          <p className="mt-2 text-muted-foreground">
            Manage the events you have created.
          </p>
        </div>

        <Link href="/events/create-event">
          <Button>Create New Event</Button>
        </Link>
      </div>

      {error && (
        <div className="mb-5 flex flex-col items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-destructive">{error}</p>

          <Button variant="outline" size="sm" onClick={handleRetry}>
            Retry
          </Button>
        </div>
      )}

      {!error && events.length === 0 && (
        <div className="rounded-xl border border-border bg-card px-6 py-12 text-center">
          <h2 className="text-xl font-semibold">
            You haven&apos;t created any events yet.
          </h2>

          <p className="mt-2 text-muted-foreground">
            Start creating events and bring your community together.
          </p>

          <Link href="/events/create-event" className="mt-5 inline-block">
            <Button>Create Your First Event</Button>
          </Link>
        </div>
      )}

      {!error && events.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              showEdit={true}
              showDelete={true}
              onDelete={(eventId) => {
                setEvents((previousEvents) =>
                  previousEvents.filter(
                    (previousEvent) => previousEvent._id !== eventId,
                  ),
                );
              }}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default ManageEventsPage;