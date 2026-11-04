"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import EventCard, { type Event } from "@/components/events/EventCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeaturedEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("http://localhost:8000/events");

        if (!res.ok) {
          throw new Error("Failed to fetch events");
        }

        const data: Event[] = await res.json();

        const today = new Date();
        const todayString = [
          today.getFullYear(),
          String(today.getMonth() + 1).padStart(2, "0"),
          String(today.getDate()).padStart(2, "0"),
        ].join("-");

        const upcomingEvents = data
          .filter((event) => event.eventDate >= todayString)
          .sort((a, b) => a.eventDate.localeCompare(b.eventDate))
          .slice(0, 6);

        setEvents(upcomingEvents);
      } catch (err) {
        console.error(err);
        setError("Unable to load featured events.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedEvents();
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Featured Events
          </h2>
          <p className="mt-2 text-muted-foreground">
            Discover upcoming opportunities to make a difference in your
            community.
          </p>
        </div>
        <Link href="/events/upcoming-events">
          <Button variant="outline">View all events</Button>
        </Link>
      </div>

      {loading && (
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
                <Skeleton className="h-9 w-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 px-6 py-10 text-center">
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {!loading && !error && events.length === 0 && (
        <div className="rounded-xl border border-border bg-card px-6 py-12 text-center">
          <h3 className="text-xl font-semibold">No upcoming events yet</h3>
          <p className="mt-2 text-muted-foreground">
            Check back soon for new opportunities to get involved.
          </p>
          <Link href="/events/explore-events" className="mt-5 inline-block">
            <Button>Explore Events</Button>
          </Link>
        </div>
      )}

      {!loading && !error && events.length > 0 && (
        <Carousel
          opts={{
            align: "start",
            loop: events.length > 1,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {events.map((event) => (
              <CarouselItem
                key={event._id}
                className="pl-4 sm:basis-1/2 lg:basis-1/3"
              >
                <EventCard event={event} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex -left-4" />
          <CarouselNext className="hidden sm:flex -right-4" />
        </Carousel>
      )}
    </section>
  );
};

export default FeaturedEvents;
