
"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import EventCard, { type Event } from "@/components/events/EventCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const categories = [
  "All",
  "Donation",
  "Environment",
  "Education",
  "Community Support",
  "Other",
];

const UpcomingEventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesCategory =
        selectedCategory === "All" ||
        event.eventType === selectedCategory;

      const query = searchQuery.toLowerCase();

      const matchesSearch =
        !query ||
        event.title.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [events, selectedCategory, searchQuery]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
  };

  const handleReset = () => {
    setSelectedCategory("All");
    setSearchInput("");
    setSearchQuery("");
  };

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

      {!loading && !error && (
        <div className="mb-8 space-y-5">
          <div>
            <h2 className="mb-3 text-sm font-semibold">
              Filter by category
            </h2>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  type="button"
                  size="sm"
                  variant={
                    selectedCategory === category
                      ? "default"
                      : "outline"
                  }
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-2 sm:flex-row"
          >
            <Input
              type="search"
              placeholder="Search by event name, location, or description..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1"
            />

            <Button type="submit">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>

            {(searchInput || searchQuery || selectedCategory !== "All") && (
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
              >
                <X className="mr-2 h-4 w-4" />
                Clear
              </Button>
            )}
          </form>
        </div>
      )}

      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
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

      {error && <p className="text-destructive">{error}</p>}

      {!loading && !error && events.length === 0 && (
        <p className="text-muted-foreground">
          No upcoming events available right now.
        </p>
      )}

      {!loading && !error && events.length > 0 && (
        <>
          <p className="mb-5 text-sm text-muted-foreground">
            Showing {filteredEvents.length} of {events.length} upcoming events
          </p>

          {filteredEvents.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-medium">No matching events found.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try another category or search term.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={handleReset}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default UpcomingEventsPage;
