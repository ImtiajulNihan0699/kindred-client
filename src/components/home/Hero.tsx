import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative isolate flex min-h-[560px] items-center overflow-hidden md:min-h-[640px]">
      {/* Background image */}
      <Image
        src="/images/hero.jpg"
        alt="Community volunteers working together to make a difference"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Dark green overlay */}
      <div className="absolute inset-0 -z-0 bg-[#173D30]/65" />

      {/* Hero content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20 md:px-10">
        <div className="max-w-2xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#B8E18A]">
            Small actions. Big impact.
          </p>

          <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
            Together, We Can
            <span className="block text-[#B8E18A]">Make a Difference.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-white/85 sm:text-lg sm:leading-8">
            Every community has the power to create positive change. Discover
            local initiatives, connect with people who care, and turn your
            willingness to help into meaningful action.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link href="/upcoming-events">
              <Button className="h-11 bg-[#8BC746] px-6 font-semibold text-[#253326] shadow-sm hover:bg-[#A0D65E]">
                Explore Events
              </Button>
            </Link>

            
           <Link href="/create-event">
            <Button
              type="button"
              className="h-11 border border-white/80 bg-transparent px-6 font-semibold text-white shadow-sm hover:bg-white/15"
            >
              Create an Event
            </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
