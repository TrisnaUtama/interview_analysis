import { motion } from "framer-motion";
import { PulseDot } from "./ui/PulseDot";

const FOOTER_LINKS = {
  Product: ["Features", "How it works", "Pricing", "Updates"],
  Company: ["About", "Blog", "Careers", "Contact"],
  Legal: ["Privacy", "Terms", "Cookies"],
};

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[#0B0C10] overflow-hidden">
      {/* subtle glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#A855F7]/30 to-transparent" />

      {/* soft background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-orange-500/5 blur-3xl rounded-full -top-40 left-1/4" />
        <div className="absolute w-[400px] h-[400px] bg-[#A855F7]/5 blur-3xl rounded-full bottom-0 right-10" />
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-16 relative z-10">
        {/* Top */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand */}
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2 font-semibold text-white text-[16px]">
              <PulseDot />
              InterviewAI
            </div>

            <p className="text-sm text-white/50 mt-4 leading-relaxed max-w-sm">
              Practice interviews that feel real. Get feedback that actually
              improves how you speak, think, and answer.
            </p>

            {/* status */}
            <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5">
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-orange-400"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-xs text-white/60">System stable</span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <p className="text-[11px] tracking-[0.18em] uppercase text-white/40 mb-4">
                {category}
              </p>

              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-white/50 hover:text-white transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} InterviewAI
          </p>

          <p className="text-xs text-white/40">
            Built with focus. Designed for progress.
          </p>
        </div>
      </div>
    </footer>
  );
}
