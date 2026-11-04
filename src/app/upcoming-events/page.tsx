
"use client";

import { useEffect, useState } from "react";
import EventCard, { type Event } from "@/components/events/EventCard";

const UpcomingEventsPage = () => {
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

        const today = new Date();
        const todayString = [
          today.getFullYear(),
          String(today.getMonth() + 1).padStart(2, "0"),
          String(today.getDate()).padStart(2, "0"),
        ].join("-");

        const upcomingEvents = data
          .filter((event) => event.eventDate >= todayString)
          .sort((a, b) => a.eventDate.localeCompare(b.eventDate));

        setEvents(upcomingEvents);
      } catch (err) {
        setError("Unable to load upcoming events.");
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
          Upcoming Events
        </h1>
        <p className="mt-2 text-muted-foreground">
          Discover upcoming opportunities to make a difference in your community.
        </p>
      </div>

      {loading && (
        <p className="text-muted-foreground">Loading events...</p>
      )}

      {error && <p className="text-destructive">{error}</p>}

      {!loading && !error && events.length === 0 && (
        <p className="text-muted-foreground">
          No upcoming events available right now.
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

export default UpcomingEventsPage;
