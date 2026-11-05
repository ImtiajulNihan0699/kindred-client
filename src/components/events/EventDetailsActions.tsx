
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Event } from "@/components/events/EventCard";

import EditButton from "@/components/updatedelete/EditButton";
import DeleteButton from "@/components/updatedelete/DeleteButton";
import JoinEventButton from "@/components/events/JoinEventButton";

type EventDetailsActionsProps = {
  event: Event;
  userId?: string;
  isEventCreator: boolean;
  showCreatorActions?: boolean;
  showJoinAction?: boolean;
};

export default function EventDetailsActions({
  event,
  userId,
  isEventCreator,
  showCreatorActions = false,
  showJoinAction = false,
}: EventDetailsActionsProps) {
  return (
    <>
      {showCreatorActions && isEventCreator && (
        <div className="flex shrink-0 gap-3">
          <EditButton
            event={event}
            onUpdated={() => window.location.reload()}
          />

          <DeleteButton
            eventId={event._id}
            redirectTo="/events/manage-events"
          />
        </div>
      )}

      {showJoinAction && (
        userId ? (
          <JoinEventButton
            eventId={event._id}
            userId={userId}
          />
        ) : (
          <Link href="/signin">
            <Button>Sign in to Join</Button>
          </Link>
        )
      )}
    </>
  );
}
