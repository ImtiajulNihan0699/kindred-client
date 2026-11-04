
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export type Event = {
  _id: string;
  title: string;
  location: string;
  eventDate: string;
  eventType: string;
  imageUrl: string;
  description: string;
};

type EventCardProps = {
  event: Event;
};

const EventCard = ({ event }: EventCardProps) => {
  const formattedDate = new Date(
    `${event.eventDate}T00:00:00`
  ).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Card className="overflow-hidden border-border bg-card text-card-foreground">
  <div className="relative h-52 w-full overflow-hidden">
  <Image
    src={event.imageUrl}
    alt={event.title}
    fill
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    className="object-cover"
  />
</div>

      <CardContent className="space-y-3 p-5">
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {event.eventType}
        </span>

        <h3 className="text-lg font-semibold">{event.title}</h3>

        <div className="space-y-1 text-sm text-muted-foreground">
          <p>📅 {formattedDate}</p>
          <p>📍 {event.location}</p>
        </div>

        <p className="text-sm text-muted-foreground">
          {event.description}
        </p>
      </CardContent>
    </Card>
  );
};

export default EventCard;
