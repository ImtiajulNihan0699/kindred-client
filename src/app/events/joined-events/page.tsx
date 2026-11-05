
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Trash2 } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import type { Event } from "@/components/events/EventCard";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

type JoinedEvent = Event & {
  joinedAt: string;
};

const JoinedEventsPage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const userId = session?.user?.id;

  const [events, setEvents] = useState<JoinedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Fetch joined events (also used by the Retry button)
  const fetchJoinedEvents = useCallback(async () => {
    if (!userId) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        throw new Error("API URL is not configured");
      }

      const res = await fetch(
        `${apiUrl}/joined-events/user/${userId}`,
        { cache: "no-store" }
      );

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const data: JoinedEvent[] = await res.json();

      setEvents(data);
      setError("");
    } catch (err) {
      console.error("Fetch joined events error:", err);
      setError("Unable to load your joined events.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Initial fetch
  useEffect(() => {
    if (isPending || !userId) return;

    let ignore = false;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const request = apiUrl
      ? fetch(`${apiUrl}/joined-events/user/${userId}`, {
          cache: "no-store",
        })
      : Promise.reject(new Error("API URL is not configured"));

    request
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }

        return (await res.json()) as JoinedEvent[];
      })
      .then((data) => {
        if (!ignore) {
          setEvents(data);
          setError("");
        }
      })
      .catch((err: unknown) => {
        console.error("Fetch joined events error:", err);

        if (!ignore) {
          setError("Unable to load your joined events.");
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [isPending, userId]);

  // Retry fetching
  const handleRetry = async () => {
    setLoading(true);
    setError("");
    await fetchJoinedEvents();
  };

  // Remove joined event
  const handleRemove = async (eventId: string) => {
    if (!userId) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      toast.error("API URL is not configured.");
      return;
    }

    try {
      setRemovingId(eventId);

      const res = await fetch(
        `${apiUrl}/joined-events/${eventId}/user/${userId}`,
        {
          method: "DELETE",
        }
      );

      const data: { message?: string } = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to remove event");
      }

      setEvents((previousEvents) =>
        previousEvents.filter((event) => event._id !== eventId)
      );

      toast.success("Event removed from your joined events.");
    } catch (err) {
      console.error("Remove joined event error:", err);

      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to remove event."
      );
    } finally {
      setRemovingId(null);
    }
  };

  // Session loading
  if (isPending) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 h-9 w-64 animate-pulse rounded bg-muted" />

        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-56 animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      </div>
    );
  }

  // User not authenticated
  if (!userId) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h2 className="text-2xl font-bold">
          Please sign in to view your joined events
        </h2>

        <p className="mt-2 text-muted-foreground">
          Sign in to keep track of the events you have joined.
        </p>

        <Button
          className="mt-6"
          onClick={() => router.push("/signin")}
        >
          Sign In
        </Button>
      </div>
    );
  }

  // Events loading
  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 h-9 w-64 animate-pulse rounded bg-muted" />

        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-56 animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="mx-auto min-h-screen max-w-7xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Joined Events
        </h1>

        <p className="mt-2 text-muted-foreground">
          Keep track of the community events you have joined.
        </p>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 px-6 py-10 text-center">
          <p className="text-destructive">{error}</p>

          <Button
            onClick={handleRetry}
            className="mt-5"
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Empty state */}
      {!error && events.length === 0 && (
        <div className="rounded-xl border border-border bg-card px-6 py-12 text-center">
          <h2 className="text-xl font-semibold">
            You haven&apos;t joined any events yet
          </h2>

          <p className="mt-2 text-muted-foreground">
            Explore upcoming events and find an opportunity to make a difference.
          </p>

          <Button
            className="mt-5"
            onClick={() => router.push("/events/explore-events")}
          >
            Explore Events
          </Button>
        </div>
      )}

      {/* Joined events */}
      {!error && events.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {events.map((event) => (
            <Card key={event._id} className="overflow-hidden">
              <div className="relative h-52 w-full">
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              <CardContent className="space-y-4 p-5">
                <div>
                  <h2 className="text-xl font-semibold">
                    {event.title}
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {event.eventType}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />

                    <span>
                      {new Date(event.eventDate).toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {event.description}
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button
                    className="flex-1"
                    onClick={() => router.push(`/events/${event._id}`)}
                  >
                    View Details
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => handleRemove(event._id)}
                    disabled={removingId === event._id}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />

                    {removingId === event._id
                      ? "Removing..."
                      : "Remove"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};

export default JoinedEventsPage;
