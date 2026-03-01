import { motion } from "framer-motion";
import { PulseDot } from "./ui/PulseDot";

const FOOTER_LINKS = {
  Product: ["Features", "How it works", "Pricing", "Changelog"],
  Company: ["About", "Blog", "Careers", "Press"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

export function Footer() {
  return (
    <footer className="border-t border-white/6 relative overflow-hidden">
      {/* Subtle top gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand/20 to-transparent" />

      <div className="max-w-300 mx-auto px-8 lg:px-16 py-16">
        {/* Top row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 font-display text-[17px] font-extrabold tracking-tight text-white mb-4">
              <PulseDot />
              InterviewAI
            </div>
            <p className="text-[13px] text-[#4B5563] leading-relaxed max-w-65">
              AI-powered interview practice that adapts to your background and
              the role you're targeting.
            </p>
            {/* Status pill */}
            <div className="inline-flex items-center gap-2 mt-5 bg-emerald-400/8 border border-emerald-400/15 px-3 py-1.5 rounded-full">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-[11px] text-emerald-400 font-medium">
                All systems operational
              </span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#374151] mb-4">
                {category}
              </p>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[13px] text-[#4B5563] hover:text-[#E8EAF0] transition-colors duration-150 no-underline"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-[12px] text-[#374151]">
            © 2026 InterviewAI. All rights reserved.
          </p>
          <p className="text-[12px] text-[#374151]">
            Built for serious candidates.
          </p>
        </div>
      </div>
    </footer>
  );
}
