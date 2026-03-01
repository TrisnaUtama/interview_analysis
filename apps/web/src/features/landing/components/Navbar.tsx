import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { PulseDot } from "./ui/PulseDot";
import { NAV_LINKS } from "../constants";
import { useNavigate } from "@tanstack/react-router";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);

      // Track active section
      const sections = NAV_LINKS.map((l) => l.toLowerCase().replace(/ /g, "-"));
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (link: string) => {
    const id = link.toLowerCase().replace(/ /g, "-");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 lg:px-16 py-5"
        animate={
          scrolled
            ? {
                backgroundColor: "rgba(8,10,15,0.88)",
                backdropFilter: "blur(20px)",
                paddingTop: "14px",
                paddingBottom: "14px",
              }
            : { backgroundColor: "transparent", backdropFilter: "none" }
        }
        transition={{ duration: 0.3 }}
        style={
          scrolled ? { borderBottom: "1px solid rgba(255,255,255,0.06)" } : {}
        }
      >
        {/* Logo */}
        <motion.div
          className="flex items-center gap-2 font-display text-[17px] font-extrabold tracking-tight text-white cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          whileHover={{ opacity: 0.85 }}
        >
          <PulseDot />
          InterviewAI
        </motion.div>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1 list-none bg-white/3 border border-white/6 rounded-full px-2 py-1.5">
          {NAV_LINKS.map((l) => {
            const id = l.toLowerCase().replace(/ /g, "-");
            const isActive = activeSection === id;
            return (
              <li key={l}>
                <button
                  onClick={() => handleNav(l)}
                  className="relative px-4 py-1.5 text-[13px] font-medium rounded-full transition-colors duration-150 cursor-pointer"
                  style={{ color: isActive ? "white" : "#6B7280" }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-white/[0.07] rounded-full"
                      transition={{ type: "spring", duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10 hover:text-[#E8EAF0] transition-colors">
                    {l}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Right */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex bg-transparent border-brand/20 text-brand hover:bg-brand/10 hover:text-brand cursor-pointer text-[13px]"
            onClick={() => navigate({ to: "/login" })}
          >
            Get Started
          </Button>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-muted-text hover:text-white transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <XMarkIcon className="size-5" />
            ) : (
              <Bars3Icon className="size-5" />
            )}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-canvas/95 backdrop-blur-md flex flex-col items-center justify-center gap-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
          >
            {NAV_LINKS.map((l, i) => (
              <motion.button
                key={l}
                onClick={() => handleNav(l)}
                className="font-display font-bold text-white text-[28px] tracking-[-1px] cursor-pointer hover:text-brand transition-colors"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                {l}
              </motion.button>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                className="mt-4 bg-brand text-canvas hover:bg-[#90CDF4] font-semibold"
                onClick={() => {
                  navigate({ to: "/login" });
                  setMobileOpen(false);
                }}
              >
                Get Started
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
