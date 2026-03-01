import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { Features } from "../components/Features";
import { HowItWorks } from "../components/HowItWorks";
import { Cta } from "../components/CTA";
import { Footer } from "../components/Footer";

export default function LandingPage() {
  return (
    <div className="font-sans bg-canvas text-[#E8EAF0] min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Cta />
      <Footer />
    </div>
  );
}
