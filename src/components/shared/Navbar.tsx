"use client";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
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
    <header className="sticky top-0 z-50 w-full border-b border-[#E5E9DF] bg-[#FAFAF6]">
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
            <h1 className="text-2xl font-bold tracking-tight text-[#3F773C]">
              Kindred
            </h1>
            <p className="text-xs text-[#687365]">Do good, together</p>
          </div>
        </Link>

        {/* Navigation links */}
        <div className="hidden items-center gap-9 md:flex">
          <Link
            href="/"
            className="text-sm font-semibold text-[#3F773C] transition-colors hover:text-[#F5A51C]"
          >
            Home
          </Link>

          <Link
            href="/upcoming-events"
            className="text-sm font-medium text-[#526052] transition-colors hover:text-[#3F773C]"
          >
            Upcoming Events
          </Link>
        </div>

        {/* Authentication buttons */}

        <div className="flex items-center gap-3">
          {user ? (
            <Popover>
              <PopoverTrigger
                render={
                  <button className="flex items-center gap-2 rounded-full px-2 py-1 transition-colors hover:bg-[#EAF3DF]">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        referrerPolicy="no-referrer"
                        src={user.image as string}
                      />
                      <AvatarFallback>
                        {user.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <span className="text-sm font-semibold text-[#253326]">
                      {user.name}
                    </span>
                  </button>
                }
              />

              <PopoverContent align="end" className="w-60">
                <div className="flex flex-col gap-1">
                  <Link
                    href="/profile"
                    className="rounded-md px-3 py-2 text-sm hover:bg-[#EAF3DF]"
                  >
                    Profile Information
                  </Link>

                  <Link
                    href="/create-event"
                    className="rounded-md px-3 py-2 text-sm hover:bg-[#EAF3DF]"
                  >
                    Create Event
                  </Link>

                  <Link
                    href="/manage-events"
                    className="rounded-md px-3 py-2 text-sm hover:bg-[#EAF3DF]"
                  >
                    Manage Events
                  </Link>

                  <div className="my-1 border-t border-[#E5E9DF]" />

                  <Button
                    variant="ghost"
                    onClick={handleSignOut}
                    className="justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
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
                  className="border-[#3F773C] text-[#3F773C] hover:bg-[#EAF3DF] hover:text-[#3F773C]"
                >
                  Sign In
                </Button>
              </Link>

              <Link href="/signup">
                <Button className="bg-[#3F773C] text-white shadow-sm transition-colors hover:bg-[#315F30]">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
