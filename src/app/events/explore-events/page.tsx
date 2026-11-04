
"use client";

import { useEffect, useState } from "react";
import EventCard, { type Event } from "@/components/events/EventCard";

const ExploreEventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:8000/events");

        if (!res.ok) {
          throw new Error("Failed to fetch events");
        }

        const data: Event[] = await res.json();

        // Sort all events by date, earliest first
        const sortedEvents = data.sort((a, b) =>
          a.eventDate.localeCompare(b.eventDate)
        );

        setEvents(sortedEvents);
      } catch (err) {
        setError("Unable to load events. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Explore Events
        </h1>

        <p className="mt-2 text-muted-foreground">
          Explore community events, discover new opportunities, and find ways
          to make a difference.
        </p>
      </div>

      {loading && (
        <p className="text-muted-foreground">Loading events...</p>
      )}

      {error && (
        <p className="text-destructive">{error}</p>
      )}

      {!loading && !error && events.length === 0 && (
        <p className="text-muted-foreground">
          No events available right now.
        </p>
      )}

      {!loading && !error && events.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </main>
  );
};

export default ExploreEventsPage;
