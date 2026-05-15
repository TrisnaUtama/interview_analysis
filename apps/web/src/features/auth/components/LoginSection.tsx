import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { authApi } from "../api/auth.api";

// Main component
export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-[#070A12] text-white overflow-hidden">
      {/* LEFT (visual only) */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center border-r border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,140,0,0.08),transparent_60%)]" />

        <div className="relative space-y-10 max-w-md">
          <h1 className="text-3xl font-semibold leading-tight">
            Train interviews with{" "}
            <span className="text-orange-400">AI precision</span>
          </h1>

          <div className="space-y-3 text-white/50 text-sm">
            <p>• Real-time interview simulation</p>
            <p>• CV + job matching analysis</p>
            <p>• Performance scoring system</p>
          </div>
        </div>
      </div>

      {/* RIGHT (login) */}
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-8">
          {/* brand */}
          <div className="text-center space-y-2">
            <div className="text-lg font-semibold">
              Interview<span className="text-orange-400">AI</span>
            </div>
            <p className="text-sm text-white/40">
              Sign in to continue your journey
            </p>
          </div>

          {/* card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6 backdrop-blur-xl">
            <GoogleLoginButton />

            <div className="text-center text-xs text-white/30 leading-relaxed">
              By continuing you agree to our{" "}
              <a className="text-orange-400">Terms</a> &{" "}
              <a className="text-orange-400">Privacy</a>
            </div>
          </div>

          {/* back */}
          <div className="text-center">
            <a
              href="/"
              className="text-xs text-white/40 hover:text-white transition"
            >
              ← Back to home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleLoginButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      onClick={() => authApi.googleSign()}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="w-full flex items-center gap-3 bg-white/5 hover:bg-white/8 border border-white/9 hover:border-brand/25 text-white rounded-xl px-5 py-3.5 text-[14px] font-medium transition-colors duration-200 cursor-pointer relative overflow-hidden group"
      whileHover={{ scale: 1.005 }}
      whileTap={{ scale: 0.995 }}
    >
      {/* Hover shimmer */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(99,179,237,0.04), transparent)",
            }}
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </AnimatePresence>

      {/* Google icon */}
      <svg
        width="17"
        height="17"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <path
          d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
          fill="#4285F4"
        />
        <path
          d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
          fill="#34A853"
        />
        <path
          d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
          fill="#FBBC05"
        />
        <path
          d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
          fill="#EA4335"
        />
      </svg>

      <span>Continue with Google</span>

      <motion.svg
        className="w-3.5 h-3.5 ml-auto text-[#374151] group-hover:text-brand transition-colors"
        viewBox="0 0 14 14"
        fill="none"
        animate={{ x: hovered ? 2 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <path
          d="M2 7h10M8 3l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>
    </motion.button>
  );
}
