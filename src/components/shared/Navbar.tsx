
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";

const Navbar = () => {
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
            className="object-contain"
          />

          <div className="leading-tight">
            <h1 className="text-2xl font-bold tracking-tight text-[#3F773C]">
              Kindred
            </h1>
            <p className="text-xs text-[#687365]">
              Do good, together
            </p>
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
          <Link href="/login">
            <Button
              variant="outline"
              className="border-[#3F773C] text-[#3F773C] hover:bg-[#EAF3DF] hover:text-[#3F773C]"
            >
              Sign In
            </Button>
          </Link>

          <Link href="/register">
            <Button className="bg-[#3F773C] text-white shadow-sm transition-colors hover:bg-[#315F30]">
              Sign Up
            </Button>
          </Link>
        </div>

      </nav>
    </header>
  );
};

export default Navbar;
