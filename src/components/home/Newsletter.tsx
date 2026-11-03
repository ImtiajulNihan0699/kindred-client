
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Newsletter = () => {
  return (
    <section className="bg-background px-6 py-16 md:px-10 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl bg-secondary px-6 py-12 md:px-14 md:py-16">

          {/* Decorative circles */}
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#8BC746]/15" />
          <div className="absolute -bottom-24 right-40 h-52 w-52 rounded-full bg-[#F5A51C]/10" />

          <div className="relative z-10 mx-auto max-w-2xl text-center">

            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-card text-primary">
              <Mail size={25} />
            </div>

            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Stay in the loop
            </p>

            <h2 className="font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl">
              Stay Connected. Keep Doing Good.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              Get updates about upcoming community events, inspiring
              stories, and new opportunities to make a difference.
            </p>

            {/* Static newsletter form */}
            <div className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email address"
                aria-label="Email address"
                className="h-12 min-w-0 flex-1 rounded-lg border border-input bg-card px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
              />

              <Button
                type="button"
                className="h-12 gap-2 px-6"
              >
                Subscribe
                <ArrowRight size={16} />
              </Button>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              No spam. Just meaningful updates from our community.
            </p>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
