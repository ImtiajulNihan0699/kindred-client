
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { auth } from "@/lib/auth";
import type { Event } from "@/components/events/EventCard";

import { Card, CardContent } from "@/components/ui/card";

import EventDetailsActions from "@/components/events/EventDetailsActions";

import {
  CalendarDays,
  MapPin,
  Users,
  HeartHandshake,
  HandHeart,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

type EventDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EventDetailsPage({
  params,
}: EventDetailsPageProps) {
  const { id } = await params;

  // Get the logged-in user's session.
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  const user = session?.user;
  const userId = user?.id;

  // Fetch event details from the backend.
  const res = await fetch(`http://localhost:8000/events/${id}`, {
    cache: "no-store",
  });

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    throw new Error("Failed to fetch event details.");
  }

  const event: Event = await res.json();

  // Check whether the logged-in user created this event.
  const isEventCreator = userId === event.createdBy;

  // Format event date.
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
          {/* Event title and creator actions */}
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

            <EventDetailsActions
              event={event}
              userId={userId}
              isEventCreator={isEventCreator}
              showCreatorActions
            />
          </div>

          {/* Event date and location */}
          <div className="grid gap-5 rounded-xl border border-border bg-muted/30 p-6 sm:grid-cols-2">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3 text-primary">
                <CalendarDays size={22} />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Event Date
                </p>

                <p className="mt-1 font-semibold">
                  {formattedDate}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3 text-primary">
                <MapPin size={22} />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Event Location
                </p>

                <p className="mt-1 font-semibold">
                  {event.location}
                </p>
              </div>
            </div>
          </div>

          {/* Event description */}
          <section>
            <h2 className="text-2xl font-bold">
              About This Event
            </h2>

            <p className="mt-4 whitespace-pre-line leading-8 text-muted-foreground">
              {event.description}
            </p>
          </section>

          {/* Why join this event */}
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">
                Why Join This Event?
              </h2>

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

                <h3 className="font-semibold">
                  Make an Impact
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Contribute your time and effort towards something that
                  benefits others.
                </p>
              </div>

              <div className="rounded-xl border border-border p-5">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
                  <Users size={24} />
                </div>

                <h3 className="font-semibold">
                  Meet People
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Connect with people who share your interest in helping the
                  community.
                </p>
              </div>

              <div className="rounded-xl border border-border p-5">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
                  <Sparkles size={24} />
                </div>

                <h3 className="font-semibold">
                  Gain Experience
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Develop teamwork, communication, and practical skills through
                  participation.
                </p>
              </div>
            </div>
          </section>

          {/* Join event action */}
          <EventDetailsActions
            event={event}
            userId={userId}
            isEventCreator={isEventCreator}
            showJoinAction
          />
        </CardContent>
      </Card>

      {/* Bottom message */}
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
}
