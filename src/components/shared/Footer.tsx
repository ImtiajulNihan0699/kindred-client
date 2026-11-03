
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#253326] text-white dark:border-border dark:bg-card">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-14">

        <div className="flex flex-col items-center text-center">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="Kindred Logo"
              width={58}
              height={58}
              className="object-contain"
            />

            <div className="text-left leading-tight">
              <h2 className="text-2xl font-bold tracking-tight">
                Kindred
              </h2>

              <p className="mt-1 text-xs text-white/60">
                Do good, together
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="mt-6 max-w-xl text-sm leading-7 text-white/65">
            Kindred brings people together through meaningful community
            initiatives. Because when people come together with kindness
            and purpose, even small actions can create lasting change.
          </p>

          {/* Decorative Divider */}
          <div className="my-9 h-px w-full max-w-3xl bg-white/15" />

          {/* Copyright */}
          <p className="text-xs leading-6 text-white/50">
            © 2026 Kindred. All rights reserved.
          </p>

          <p className="mt-2 text-xs text-white/40">
            Built with care for communities everywhere.
          </p>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
