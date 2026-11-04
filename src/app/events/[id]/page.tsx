"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Event } from "@/components/events/EventCard";

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

const EventDetailsPage = () => {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`http://localhost:8000/events/${id}`);

        if (!res.ok) {
          throw new Error("Failed to fetch event");
        }

        const data: Event = await res.json();
        setEvent(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load event details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading || isPending) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-muted-foreground">Loading event details...</p>
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

        <Button className="mt-5" onClick={() => router.back()}>
          Go Back
        </Button>
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

  const isPastEvent = new Date(`${event.eventDate}T23:59:59`) < new Date();

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      {/* Back Navigation */}
      <Link
        href="/events/explore-events"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft size={16} />
        Back to Events
      </Link>

      <Card className="overflow-hidden border-border bg-card">
        {/* Event Image */}
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
          {/* Event Heading */}
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

            {/* Creator-only Actions */}
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

          {/* Event Information */}
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

          {/* Event Description */}
          <section>
            <h2 className="text-2xl font-bold">About This Event</h2>

            <p className="mt-4 whitespace-pre-line leading-8 text-muted-foreground">
              {event.description}
            </p>
          </section>

          {/* Why Join Section */}
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Why Join This Event?</h2>

              <p className="mt-2 text-muted-foreground">
                Every contribution matters. Your participation can help create a
                stronger and more connected community.
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

          {/* Join Event Section - Visible to Everyone */}
          <section className="rounded-2xl bg-primary/5 p-6 sm:p-8">
            <div className="flex flex-col items-center gap-5 text-center">
              <div className="rounded-full bg-primary/10 p-4 text-primary">
                <HandHeart size={32} />
              </div>

              <div className="max-w-xl">
                <h2 className="text-2xl font-bold">
                  Be Part of Something Meaningful
                </h2>

                <p className="mt-3 leading-7 text-muted-foreground">
                  Your involvement can make a real difference. Take the first
                  step and become part of this community initiative.
                </p>
              </div>

              <Button
                size="lg"
                className="w-full sm:w-auto"
                disabled={isPastEvent}
              >
                {isPastEvent ? "Event Has Ended" : "Join This Event"}
              </Button>

              <p className="text-xs text-muted-foreground">
                {isPastEvent
                  ? "This event date has already passed."
                  : "Join functionality will be available soon."}
              </p>
            </div>
          </section>
        </CardContent>
      </Card>

      {/* Community Message */}
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
