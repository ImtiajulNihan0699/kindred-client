"use client";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThemeToggle from "@/components/shared/ThemeToggle";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;
 

  const handleSignOut = async () => {
    await authClient.signOut();
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Kindred Logo"
            width={52}
            height={52}
            priority
            className="h-[52px] w-auto object-contain"
          />

          <div className="leading-tight">
            <h1 className="text-2xl font-bold tracking-tight text-primary">
              Kindred
            </h1>
            <p className="text-xs text-muted-foreground">Do good, together</p>
          </div>
        </Link>

        {/* Navigation links */}
        <div className="hidden items-center gap-9 md:flex">
          <Link
            href="/"
            className="text-sm font-semibold text-primary transition-colors hover:text-[#F5A51C]"
          >
            Home
          </Link>

          <Link
            href="/events/upcoming-events"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Upcoming Events 
          </Link>
        </div>
        <div className="flex items-center gap-2 m-2">
        {/* Theme toggle button */}
        <ThemeToggle />

        {/* Authentication buttons */}

        <div className="flex items-center gap-3">
          {user ? (
            <Popover>
              <PopoverTrigger
                render={
                  <button className="flex items-center gap-2 rounded-full px-2 py-1 transition-colors hover:bg-accent">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        referrerPolicy="no-referrer"
                        src={user.image as string}
                      />
                      <AvatarFallback>
                        {user.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <span className="text-sm font-semibold text-foreground">
                      {user.name}
                    </span>
                  </button>
                }
              />

              <PopoverContent align="end" className="w-60">
                <div className="flex flex-col gap-1">
                  <Link
                    href="/profile"
                    className="rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    Profile Information
                  </Link>

                  <Link
                    href="/events/create-event"
                    className="rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    Create Event
                  </Link>

                  <Link
                    href="/events/manage-events"
                    className="rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    Manage Events
                  </Link>

                  <Link
                    href="/events/joined-events"
                    className="rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    Joined Events
                  </Link>

                  <div className="my-1 border-t border-border" />

                  <Button
                    variant="ghost"
                    onClick={handleSignOut}
                    className="justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    Sign Out
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <>
              <Link href="/signin">
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-secondary hover:text-primary"
                >
                  Sign In
                </Button>
              </Link>

              <Link href="/signup">
                <Button className="shadow-sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
