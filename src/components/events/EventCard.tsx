import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import EditButton from "../updatedelete/EditButton";

export type Event = {
  _id: string;
  title: string;
  location: string;
  eventDate: string;
  eventType: string;
  imageUrl: string;
  description: string;
  createdBy: string;
};

type EventCardProps = {
  event: Event;
  showEdit?: boolean;
  showDelete?: boolean;
};

const EventCard = ({
  event,
  showEdit = false,
  showDelete = false,
}: EventCardProps) => {
  const formattedDate = new Date(
    `${event.eventDate}T00:00:00`,
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

        <p className="text-sm text-muted-foreground">{event.description}</p>

        <div className="flex gap-2">
          <Link href={`/events/${event._id}`} className="flex-1">
            <Button className="w-full">View Details</Button>
          </Link>

          {showEdit && (
            <EditButton event={event} />
          )}

          {showDelete && (
            <Button variant="destructive" className="flex-1">
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
