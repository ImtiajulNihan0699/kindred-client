
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import EditButton from "@/components/updatedelete/EditButton";
import DeleteButton from "@/components/updatedelete/DeleteButton";

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
  onDelete?: (eventId: string) => void;
  onUpdated?: (updatedEvent: Event) => void;
};

const EventCard = ({
  event,
  showEdit = false,
  showDelete = false,
  onDelete,
  onUpdated,
}: EventCardProps) => {
  const router = useRouter();

  const formattedDate = new Date(
    `${event.eventDate}T00:00:00`
  ).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Card className="overflow-hidden border-border bg-card text-card-foreground">
      {/* Event Image */}
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
        {/* Event Category */}
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {event.eventType}
        </span>

        {/* Event Title */}
        <h3 className="text-lg font-semibold">
          {event.title}
        </h3>

        {/* Event Information */}
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>📅 {formattedDate}</p>
          <p>📍 {event.location}</p>
        </div>

        {/* Event Description */}
        <p className="text-sm text-muted-foreground">
          {event.description}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            className="flex-1"
            onClick={() => router.push(`/events/${event._id}`)}
          >
            View Details
          </Button>

          {showEdit && (
            <EditButton
              event={event}
              onUpdated={onUpdated}
            />
          )}

          {showDelete && (
            <DeleteButton
              eventId={event._id}
              redirectTo="/events/manage-events"
              onDeleted={onDelete}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
