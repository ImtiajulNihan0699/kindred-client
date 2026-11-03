
import {
  Heart,
  HandHeart,
  Users,
  MapPin,
} from "lucide-react";

const impactStats = [
  {
    value: "1,000+",
    label: "Donations Made",
    description: "Essential supplies and resources shared with people in need.",
    icon: HandHeart,
    iconStyle: "bg-secondary text-primary",
  },
  {
    value: "50+",
    label: "Community Events",
    description: "Local initiatives bringing people together for good causes.",
    icon: Heart,
    iconStyle:
      "bg-[#FFF2D9] text-[#C17B13] dark:bg-[#F5A51C]/15 dark:text-[#F5A51C]",
  },
  {
    value: "500+",
    label: "Volunteers",
    description: "Kind-hearted people giving their time to make a difference.",
    icon: Users,
    iconStyle:
      "bg-[#FCE9E1] text-[#C56C43] dark:bg-[#D97832]/15 dark:text-[#D97832]",
  },
  {
    value: "30+",
    label: "Communities Reached",
    description: "Neighbourhoods connected through meaningful activities.",
    icon: MapPin,
    iconStyle:
      "bg-[#E8EFFB] text-[#496DA8] dark:bg-[#496DA8]/20 dark:text-[#8FB3E8]",
  },
];

const CommunityActivities = () => {
  return (
    <section className="bg-background px-6 py-20 md:px-10 md:py-24">
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Our growing impact
          </p>

          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Together, We Make It Happen
          </h2>

          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Every small act of kindness adds up. Here is a glimpse of
            the positive change a united community can create.
          </p>
        </div>

        {/* Impact Statistics */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {impactStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
              >
                <div
                  className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconStyle}`}
                >
                  <Icon size={23} strokeWidth={1.8} />
                </div>

                <h3 className="text-3xl font-bold tracking-tight text-primary">
                  {stat.value}
                </h3>

                <p className="mt-2 text-base font-semibold text-foreground">
                  {stat.label}
                </p>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Closing Message */}
        <div className="mt-12 flex flex-col items-center justify-center gap-3 text-center sm:flex-row">
          <Heart size={19} className="fill-[#F5A51C] text-[#F5A51C]" />

          <p className="text-sm font-medium text-muted-foreground">
            Every contribution matters. Every volunteer makes a difference.
          </p>
        </div>

      </div>
    </section>
  );
};

export default CommunityActivities;
