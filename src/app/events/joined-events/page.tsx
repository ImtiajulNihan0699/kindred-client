"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import type { Event } from "@/components/events/EventCard";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, MapPin, CalendarDays } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type JoinedEvent = Event & {
  joinedAt: string;
};

const JoinedEventsPage = () => {
  const { data: session, isPending } = authClient.useSession();
  const userId = session?.user?.id;

  const [events, setEvents] = useState<JoinedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchJoinedEvents = useCallback(async () => {
    if (!userId) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/joined-events/user/${userId}`,
        { cache: "no-store" },
      );

      if (!res.ok) {
        throw new Error("Failed to fetch joined events");
      }

      const data: JoinedEvent[] = await res.json();

      setEvents(data);
      setError("");
    } catch (error) {
      console.error(error);
      setError("Unable to load your joined events.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (isPending || !userId) return;

    let ignore = false;

    const loadJoinedEvents = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/joined-events/user/${userId}`,
          { cache: "no-store" },
        );

        if (!res.ok) {
          throw new Error("Failed to fetch joined events");
        }

        const data: JoinedEvent[] = await res.json();

        if (!ignore) {
          setEvents(data);
          setError("");
        }
      } catch (error) {
        console.error(error);

        if (!ignore) {
          setError("Unable to load your joined events.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadJoinedEvents();

    return () => {
      ignore = true;
    };
  }, [userId, isPending]);

  const handleRetry = async () => {
    setLoading(true);
    setError("");
    await fetchJoinedEvents();
  };

  const handleRemove = async (eventId: string) => {
    if (!userId) return;

    const confirmed = window.confirm(
      "Are you sure you want to remove this event from your joined events?",
    );

    if (!confirmed) return;

    try {
      setRemovingId(eventId);

      const res = await fetch(
        `http://localhost:8000/joined-events/${eventId}/user/${userId}`,
        {
          method: "DELETE",
        },
      );

      const data: { message?: string } = await res
        .json()
        .catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to remove event");
      }

      setEvents((previousEvents) =>
        previousEvents.filter((event) => event._id !== eventId),
      );

      toast.success("Event removed from your joined events");
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setRemovingId(null);
    }
  };

  if (isPending) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-72" />
        </div>

        <div className="space-y-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="overflow-hidden border-border bg-card">
              <CardContent className="flex flex-col gap-5 p-4 sm:flex-row sm:items-center sm:p-5">
                <Skeleton className="h-52 w-full rounded-lg sm:h-32 sm:w-48" />

                <div className="min-w-0 flex-1 space-y-3">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-7 w-2/3" />

                  <div className="flex flex-wrap gap-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </div>

                <div className="flex shrink-0 flex-col gap-2 sm:w-36">
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16 text-center">
        <h1 className="text-2xl font-bold">Please sign in</h1>

        <p className="mt-2 text-muted-foreground">
          Sign in to view the events you have joined.
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
        <div className="mb-8 space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-72" />
        </div>

        <div className="space-y-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="overflow-hidden border-border bg-card">
              <CardContent className="flex flex-col gap-5 p-4 sm:flex-row sm:items-center sm:p-5">
                <Skeleton className="h-52 w-full rounded-lg sm:h-32 sm:w-48" />

                <div className="min-w-0 flex-1 space-y-3">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-7 w-2/3" />

                  <div className="flex flex-wrap gap-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </div>

                <div className="flex shrink-0 flex-col gap-2 sm:w-36">
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Joined Events</h1>

        <p className="mt-2 text-muted-foreground">
          Keep track of the community events you have joined.
        </p>
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
        <div className="rounded-xl border border-border bg-card px-6 py-16 text-center">
          <h2 className="text-xl font-semibold">
            You haven&apos;t joined any events yet.
          </h2>

          <p className="mt-2 text-muted-foreground">
            Explore events and find a way to contribute to your community.
          </p>

          <Link href="/events/explore-events" className="mt-5 inline-block">
            <Button>Explore Events</Button>
          </Link>
        </div>
      )}

      {!error && events.length > 0 && (
        <div className="space-y-5">
          {events.map((event) => {
            const formattedDate = new Date(
              `${event.eventDate}T00:00:00`,
            ).toLocaleDateString("en-BD", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            return (
              <Card
                key={event._id}
                className="overflow-hidden border-border bg-card"
              >
                <CardContent className="flex flex-col gap-5 p-4 sm:flex-row sm:items-center sm:p-5">
                  <div className="relative h-52 w-full shrink-0 overflow-hidden rounded-lg sm:h-32 sm:w-48">
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 192px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1 space-y-2">
                    <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {event.eventType}
                    </span>

                    <h2 className="text-xl font-semibold">{event.title}</h2>

                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <CalendarDays className="size-4" />
                        {formattedDate}
                      </span>

                      <span className="flex items-center gap-2">
                        <MapPin className="size-4" />
                        {event.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col gap-2 sm:w-36">
                    <Link href={`/events/${event._id}`}>
                      <Button className="w-full">View Details</Button>
                    </Link>

                    <Button
                      variant="outline"
                      className="w-full"
                      disabled={removingId === event._id}
                      onClick={() => handleRemove(event._id)}
                    >
                      <Trash2 className="mr-2 size-4" />

                      {removingId === event._id ? "Removing..." : "Remove"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default JoinedEventsPage;