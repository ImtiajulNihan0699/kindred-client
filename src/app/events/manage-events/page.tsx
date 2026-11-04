
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import EventCard, { type Event } from "@/components/events/EventCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ManageEventsPage = () => {
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const userId = user?.id;

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPending || !userId) return;

    const fetchUserEvents = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/events/user/${userId}`,
        );

        if (!res.ok) {
          throw new Error("Failed to fetch your events");
        }

        const data: Event[] = await res.json();
        setEvents(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load your events.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, [userId, isPending]);

  // Session loading
  if (isPending) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-muted-foreground">
          Loading session...
        </p>
      </main>
    );
  }

  // User is not logged in
  if (!user) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12 text-center">
        <h1 className="text-2xl font-bold">
          Please sign in
        </h1>

        <p className="mt-2 text-muted-foreground">
          You need to sign in to manage your events.
        </p>

        <Link href="/signin" className="mt-5 inline-block">
          <Button>Sign In</Button>
        </Link>
      </main>
    );
  }

  // Events loading
  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-muted-foreground">
          Loading your events...
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      {/* Page heading */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Manage Events
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage the events you have created.
          </p>
        </div>

        <Link href="/events/create-event">
          <Button>Create New Event</Button>
        </Link>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-destructive">{error}</p>
      )}

      {/* Empty state */}
      {!error && events.length === 0 && (
        <div className="rounded-xl border border-border bg-card px-6 py-12 text-center">
          <h2 className="text-xl font-semibold">
            You haven&apos;t created any events yet.
          </h2>

          <p className="mt-2 text-muted-foreground">
            Start creating events and bring your community together.
          </p>

          <Link
            href="/events/create-event"
            className="mt-5 inline-block"
          >
            <Button>Create Your First Event</Button>
          </Link>
        </div>
      )}

      {/* User's events */}
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
                    (event) => event._id !== eventId,
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
