import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "@tanstack/react-router";
import { NAV_LINKS } from "../constants";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);

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
      {/* ================= NAVBAR ================= */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-16 py-5"
        animate={
          scrolled
            ? {
                backgroundColor: "rgba(28,28,31,0.72)", // soft black glass
                backdropFilter: "blur(18px)",
                paddingTop: "14px",
                paddingBottom: "14px",
              }
            : { backgroundColor: "transparent" }
        }
        transition={{ duration: 0.3 }}
        style={
          scrolled ? { borderBottom: "1px solid rgba(255,255,255,0.06)" } : {}
        }
      >
        {/* ================= LOGO ================= */}
        <motion.div
          className="flex items-center gap-2  text-[17px] font-extrabold tracking-tight text-white cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          whileHover={{ scale: 1.02 }}
        >
          TalkHire
        </motion.div>

        {/* ================= DESKTOP NAV ================= */}
        <ul className="hidden md:flex items-center gap-1 rounded-full px-2 py-1.5 bg-white/5 border border-white/10 backdrop-blur-xl">
          {NAV_LINKS.map((l) => {
            const id = l.toLowerCase().replace(/ /g, "-");
            const isActive = activeSection === id;

            return (
              <li key={l}>
                <button
                  onClick={() => handleNav(l)}
                  className="relative px-4 py-1.5 text-[13px] font-medium rounded-full transition-all"
                >
                  {/* ACTIVE BACKGROUND */}
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 rounded-full bg-brand/15 border border-brand/30"
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}

                  <span
                    className={`relative z-10 transition-colors ${
                      isActive ? "text-white" : "text-white/50 hover:text-white"
                    }`}
                  >
                    {l}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* ================= RIGHT ACTIONS ================= */}
        <div className="flex items-center gap-3">
          <Button
            className="hidden md:flex bg-brand hover:bg-brand/90 text-white text-[13px] shadow-[0_10px_30px_rgba(249,115,22,0.25)] cursor-pointer"
            onClick={() => navigate({ to: "/login" })}
          >
            Get Started
          </Button>

          {/* MOBILE TOGGLE */}
          <button
            className="md:hidden text-white/70 hover:text-white transition"
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

      {/* ================= MOBILE MENU ================= */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-background/95 backdrop-blur-xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {NAV_LINKS.map((l, i) => (
              <motion.button
                key={l}
                onClick={() => handleNav(l)}
                className=" font-bold text-[30px] tracking-[-1px] text-foreground hover:text-brand transition"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                {l}
              </motion.button>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              <Button
                className="mt-4 bg-brand text-white hover:bg-brand/90 font-semibold px-6"
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
