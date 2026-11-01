import Link from "next/link";
import { HeartHandshake } from "lucide-react";

import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <HeartHandshake className="h-9 w-9 text-[#245C45]" />

          <div>
            <h1 className="text-xl font-bold text-[#245C45]">Kindred</h1>
            <p className="text-xs text-gray-500">Do good, together</p>
          </div>
        </Link>

        {/* Navigation links */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-[#245C45] transition hover:text-[#E99A45]"
          >
            Home
          </Link>

          <Link
            href="/upcoming-events"
            className="text-sm font-medium text-gray-700 transition hover:text-[#245C45]"
          >
            Upcoming Events
          </Link>
        </div>

        {/* Authentication buttons */}
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="outline">Sign In</Button>
          </Link>

          <Link href="/register">
            <Button className="bg-[#245C45] text-white hover:bg-[#173D30]">
              Sign Up
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
