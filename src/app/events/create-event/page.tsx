
"use client";

import { useSyncExternalStore } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Get today's date in YYYY-MM-DD format.
const subscribe = () => () => {};

const getTodayDate = () => {
  const today = new Date();

  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
};

const CreateEventPage = () => {
  const router = useRouter();
const { data: session } = authClient.useSession();
const user = session?.user;
 const handleCreateEvent = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!user) {
    alert("Please sign in to create an event.");
    return;
  }

  const formData = new FormData(e.currentTarget);
  const createEventData = Object.fromEntries(formData.entries());

  const eventData = {
    ...createEventData,
    createdBy: user.id,
  };

  try {
    const res = await fetch("http://localhost:8000/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });

    if (!res.ok) {
      throw new Error("Failed to create event");
    }

    const data = await res.json();
    console.log(data);

    // Redirect after successful event creation
    router.push("/events/manage-events");
  } catch (error) {
    console.error(error);
    alert("Something went wrong while creating the event.");
  }
};

  const minDate = useSyncExternalStore(
    subscribe,
    getTodayDate,
    () => ""
  );

  return (
    <div className="mx-auto my-10 max-w-2xl px-6">
      <Card>
        <CardHeader>
          <CardTitle>Create an event</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleCreateEvent}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="title">Title</FieldLabel>
                <Input
                  id="title"
                  name="title"
                  placeholder="Tree plantation drive"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="location">Location</FieldLabel>
                <Input
                  id="location"
                  name="location"
                  placeholder="Chattogram"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="eventDate">Date</FieldLabel>
                <Input
                  id="eventDate"
                  name="eventDate"
                  type="date"
                  min={minDate}
                  disabled={!minDate}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="eventType">Event Category</FieldLabel>
                <select
                  id="eventType"
                  name="eventType"
                  required
                  defaultValue=""
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  <option value="Donation">Donation</option>
                  <option value="Environment">Environment</option>
                  <option value="Education">Education</option>
                  <option value="Community Support">Community Support</option>
                  <option value="Other">Other</option>
                </select>
              </Field>

              <Field>
                <FieldLabel htmlFor="imageUrl">Image URL</FieldLabel>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  placeholder="https://i.ibb.co/..."
                  required
                />
                <FieldDescription>
                  Paste the direct link from ImgBB.
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                />
              </Field>

              <Field>
                <Button type="submit">Create event</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateEventPage;
