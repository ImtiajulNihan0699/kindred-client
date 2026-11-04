"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Event } from "@/components/events/EventCard";
import { Skeleton } from "@/components/ui/skeleton";

import {
  CalendarDays,
  MapPin,
  Users,
  HeartHandshake,
  HandHeart,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

import EditButton from "@/components/updatedelete/EditButton";
import DeleteButton from "@/components/updatedelete/DeleteButton";
import JoinEventButton from "@/components/events/JoinEventButton";

const EventDetailsPage = () => {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const userId = user?.id;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEvent = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:8000/events/${id}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch event");
      }

      const data: Event = await res.json();
      setEvent(data);
      setError("");
    } catch (error) {
      console.error(error);
      setError("Unable to load event details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    let ignore = false;

    const loadEvent = async () => {
      try {
        const res = await fetch(`http://localhost:8000/events/${id}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch event");
        }

        const data: Event = await res.json();

        if (!ignore) {
          setEvent(data);
          setError("");
        }
      } catch (error) {
        console.error(error);

        if (!ignore) {
          setError("Unable to load event details.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadEvent();

    return () => {
      ignore = true;
    };
  }, [id]);

  const handleRetry = async () => {
    setLoading(true);
    setError("");
    await fetchEvent();
  };

  if (loading || isPending) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Skeleton className="mb-6 h-5 w-32" />

        <Card className="overflow-hidden border-border bg-card">
          <Skeleton className="h-72 w-full rounded-none sm:h-[460px]" />

          <CardContent className="space-y-10 p-6 sm:p-10">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
              <div className="space-y-3">
                <Skeleton className="h-7 w-24 rounded-full" />
                <Skeleton className="h-10 w-2/3 sm:h-12" />
                <Skeleton className="h-5 w-4/5" />
              </div>

              <div className="flex gap-3">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
              </div>
            </div>

            <div className="grid gap-5 rounded-xl border border-border bg-muted/30 p-6 sm:grid-cols-2">
              <div className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-40" />
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            <Skeleton className="h-10 w-40" />
          </CardContent>
        </Card>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-12 text-center">
        <h1 className="text-2xl font-bold">Event Not Found</h1>

        <p className="mt-2 text-muted-foreground">
          {error || "This event may have been removed."}
        </p>

        <div className="mt-5 flex items-center justify-center gap-3">
          <Button onClick={handleRetry}>Retry</Button>

          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </main>
    );
  }

  const isEventCreator = user?.id === event.createdBy;

  const formattedDate = new Date(
    `${event.eventDate}T00:00:00`,
  ).toLocaleDateString("en-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <Link
        href="/events/explore-events"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft size={16} />
        Back to Events
      </Link>

      <Card className="overflow-hidden border-border bg-card">
        <div className="relative h-72 w-full sm:h-[460px]">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        <CardContent className="space-y-10 p-6 sm:p-10">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
            <div className="space-y-3">
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                {event.eventType}
              </span>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {event.title}
              </h1>

              <p className="text-muted-foreground">
                Be part of something meaningful. Join your community and make a
                positive difference.
              </p>
            </div>

            {isEventCreator && (
              <div className="flex shrink-0 gap-3">
                <EditButton
                  event={event}
                  onUpdated={(updatedEvent) => setEvent(updatedEvent)}
                />

                <DeleteButton
                  eventId={event._id}
                  redirectTo="/events/manage-events"
                />
              </div>
            )}
          </div>

          <div className="grid gap-5 rounded-xl border border-border bg-muted/30 p-6 sm:grid-cols-2">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3 text-primary">
                <CalendarDays size={22} />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Event Date</p>
                <p className="mt-1 font-semibold">{formattedDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3 text-primary">
                <MapPin size={22} />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Event Location</p>
                <p className="mt-1 font-semibold">{event.location}</p>
              </div>
            </div>
          </div>

          <section>
            <h2 className="text-2xl font-bold">About This Event</h2>

            <p className="mt-4 whitespace-pre-line leading-8 text-muted-foreground">
              {event.description}
            </p>
          </section>

          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Why Join This Event?</h2>

              <p className="mt-2 text-muted-foreground">
                Every contribution matters. Your participation can help create
                a stronger and more connected community.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div className="rounded-xl border border-border p-5">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
                  <HeartHandshake size={24} />
                </div>

                <h3 className="font-semibold">Make an Impact</h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Contribute your time and effort towards something that
                  benefits others.
                </p>
              </div>

              <div className="rounded-xl border border-border p-5">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
                  <Users size={24} />
                </div>

                <h3 className="font-semibold">Meet People</h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Connect with people who share your interest in helping the
                  community.
                </p>
              </div>

              <div className="rounded-xl border border-border p-5">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
                  <Sparkles size={24} />
                </div>

                <h3 className="font-semibold">Gain Experience</h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Develop teamwork, communication, and practical skills through
                  participation.
                </p>
              </div>
            </div>
          </section>

          {userId ? (
            <JoinEventButton eventId={event._id} userId={userId} />
          ) : (
            <Link href="/signin">
              <Button>Sign in to Join</Button>
            </Link>
          )}
        </CardContent>
      </Card>

      <div className="mt-8 flex flex-col items-center gap-3 text-center">
        <HandHeart size={28} className="text-primary" />

        <h2 className="text-xl font-semibold">
          Together, We Can Make a Difference
        </h2>

        <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
          Kindred brings people together through meaningful community
          activities. Every small action can contribute to a better tomorrow.
        </p>
      </div>
    </main>
  );
};

export default EventDetailsPage;