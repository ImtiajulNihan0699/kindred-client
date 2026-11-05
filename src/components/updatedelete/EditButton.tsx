
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../ui/button";

import type { Event } from "@/components/events/EventCard";

type EditButtonProps = {
  event: Event;
  onUpdated?: (updatedEvent: Event) => void;
};

type EventFormData = Pick<
  Event,
  | "title"
  | "location"
  | "eventDate"
  | "eventType"
  | "imageUrl"
  | "description"
>;

const EditButton = ({ event, onUpdated }: EditButtonProps) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const getInitialValues = (): EventFormData => ({
    title: event.title,
    location: event.location,
    eventDate: event.eventDate,
    eventType: event.eventType,
    imageUrl: event.imageUrl,
    description: event.description,
  });

  const [formData, setFormData] = useState<EventFormData>(
    getInitialValues
  );

  const hasChanges = Object.keys(formData).some((key) => {
    const field = key as keyof EventFormData;
    return formData[field] !== event[field];
  });

  const handleChange = (
    field: keyof EventFormData,
    value: string
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleDialogChange = (isOpen: boolean) => {
    setOpen(isOpen);

    if (isOpen) {
      setFormData(getInitialValues());
    }
  };

  const handleUpdateEvent = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!hasChanges || isUpdating) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      toast.error("API URL is not configured.");
      return;
    }

    try {
      setIsUpdating(true);

      const res = await fetch(
        `${apiUrl}/events/${event._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const errorData: { message?: string } = await res
        .json()
        .catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          errorData.message || "Failed to update event."
        );
      }

      const updatedEvent: Event = {
        ...event,
        ...formData,
      };

      toast.success("Event updated successfully.");

      setOpen(false);

      if (onUpdated) {
        onUpdated(updatedEvent);
      } else {
        router.push(`/events/${event._id}`);
      }

      router.refresh();
    } catch (error) {
      console.error("Update event error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong while updating the event."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger
        render={
          <Button variant="outline" className="flex-1">
            <Pencil />
            Edit
          </Button>
        }
      />

      <DialogContent className="max-h-[85vh] w-[95vw] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            Update the information about your event.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUpdateEvent}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  handleChange("title", e.target.value)
                }
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="location">Location</FieldLabel>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  handleChange("location", e.target.value)
                }
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="eventDate">Date</FieldLabel>
              <Input
                id="eventDate"
                type="date"
                value={formData.eventDate}
                onChange={(e) =>
                  handleChange("eventDate", e.target.value)
                }
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="eventType">
                Event Category
              </FieldLabel>

              <select
                id="eventType"
                value={formData.eventType}
                onChange={(e) =>
                  handleChange("eventType", e.target.value)
                }
                required
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="Donation">Donation</option>
                <option value="Environment">Environment</option>
                <option value="Education">Education</option>
                <option value="Community Support">
                  Community Support
                </option>
                <option value="Other">Other</option>
              </select>
            </Field>

            <Field>
              <FieldLabel htmlFor="imageUrl">Image URL</FieldLabel>
              <Input
                id="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={(e) =>
                  handleChange("imageUrl", e.target.value)
                }
                required
              />
              <FieldDescription>
                Paste the direct link from ImgBB.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="description">
                Description
              </FieldLabel>
              <Textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  handleChange("description", e.target.value)
                }
                required
              />
            </Field>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogChange(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={!hasChanges || isUpdating}
              >
                {isUpdating ? "Updating..." : "Update Event"}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditButton;
