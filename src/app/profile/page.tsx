
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const currentUser = session?.user;

  const [name, setName] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const displayName = name ?? currentUser?.name ?? "";
  const displayImage = image ?? currentUser?.image ?? "";

  const handleUpdateUser = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setIsUpdating(true);

    try {
      const { error } = await authClient.updateUser({
        name: displayName,
        image: displayImage,
      });

      if (error) {
        toast.error(error.message || "Failed to update profile.");
        return;
      }

      toast.success("Profile updated successfully!");

      router.push("/");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isPending) {
    return (
      <p className="py-20 text-center text-muted-foreground">
        Loading profile...
      </p>
    );
  }

  if (!currentUser) {
    return (
      <p className="py-20 text-center text-muted-foreground">
        No user information found.
      </p>
    );
  }

  return (
    <div className="mx-auto my-10 flex max-w-2xl flex-col gap-6 px-6 sm:px-10">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            Profile Information
          </CardTitle>

          <CardDescription>
            View and update your account information.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleUpdateUser}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>

                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="image">
                  Profile Image URL
                </FieldLabel>

                <Input
                  id="image"
                  name="image"
                  type="url"
                  value={displayImage}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Your image URL"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={currentUser.email}
                  disabled
                />
              </Field>

              <Field>
                <Button
                  className="w-fit"
                  type="submit"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Update Profile"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
