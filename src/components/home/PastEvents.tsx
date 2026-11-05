
import Image from "next/image";
import { MapPin, CalendarDays } from "lucide-react";

const pastEvents = [
  {
    id: 1,
    title: "Community Food Distribution",
    location: "Chattogram, Bangladesh",
    date: "October 12, 2026",
    image: "/images/past-event-01.jpg",
  },
  {
    id: 2,
    title: "Green Earth Campaign",
    location: "Dhaka, Bangladesh",
    date: "September 25, 2026",
    image: "/images/past-event-02.jpg",
  },
  {
    id: 3,
    title: "Educational Support Program",
    location: "Cumilla, Bangladesh",
    date: "September 10, 2026",
    image: "/images/past-event-03.jpg",
  },
  {
    id: 4,
    title: "Winter Clothing Drive",
    location: "Sylhet, Bangladesh",
    date: "August 18, 2026",
    image: "/images/past-event-04.jpg",
  },
  {
    id: 5,
    title: "Community Cleanup Day",
    location: "Chattogram, Bangladesh",
    date: "July 30, 2026",
    image: "/images/past-event-05.jpg",
  },
  {
    id: 6,
    title: "Youth Volunteer Meetup",
    location: "Dhaka, Bangladesh",
    date: "July 15, 2026",
    image: "/images/past-event-06.jpg",
  },
];

export default function PastEvents() {
  return (
    <section className="w-full min-w-0 py-16 md:py-20">
      <div className="mx-auto w-full max-w-7xl min-w-0 px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            Our Memories
          </p>

          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Past Events
          </h2>

          <p className="mt-3 max-w-2xl text-muted-foreground">
            A look back at the moments, people, and communities we have
            brought together.
          </p>
        </div>

        <div className="grid w-full min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pastEvents.map((event) => (
            <article
              key={event.id}
              className="group min-w-0 overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-lg"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="space-y-3 p-5">
                <h3 className="text-lg font-semibold leading-snug">
                  {event.title}
                </h3>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="size-4 shrink-0" />
                  <span>{event.location}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="size-4 shrink-0" />
                  <span>{event.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
