"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type JoinEventButtonProps = {
  eventId: string;
  userId: string;
};

const JoinEventButton = ({
  eventId,
  userId,
}: JoinEventButtonProps) => {
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  // Check whether the user has already joined this event
  useEffect(() => {
    let ignore = false;

    const fetchJoinedStatus = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/joined-events/user/${userId}/check/${eventId}`,
          { cache: "no-store" },
        );

        if (!res.ok) {
          throw new Error("Failed to check joined status");
        }

        const data = await res.json();

        if (!ignore) {
          setIsJoined(data.isJoined);
        }
      } catch (error) {
        if (!ignore) {
          console.error(error);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    fetchJoinedStatus();

    return () => {
      ignore = true;
    };
  }, [eventId, userId]);

  // Join the event
  const handleJoin = async () => {
    try {
      setIsJoining(true);

      const res = await fetch(
        "http://localhost:8000/joined-events",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            eventId,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to join event",
        );
      }

      setIsJoined(true);
      toast.success("You have successfully joined this event");
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong",
      );
    } finally {
      setIsJoining(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Button disabled className="w-full sm:w-auto">
        Checking...
      </Button>
    );
  }

  return (
    <Button
      onClick={handleJoin}
      disabled={isJoined || isJoining}
      className="w-full sm:w-auto"
    >
      {isJoining
        ? "Joining..."
        : isJoined
          ? "Already Joined"
          : "Join This Event"}
    </Button>
  );
};

export default JoinEventButton;
