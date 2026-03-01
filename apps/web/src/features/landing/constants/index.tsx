export const NAV_LINKS = ["Features", "How it works"];
import { RocketLaunchIcon } from "@heroicons/react/24/solid";
import {
  SparklesIcon,
  MicrophoneIcon,
  BoltIcon,
  BriefcaseIcon,
  AdjustmentsHorizontalIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export const FEATURES = [
  {
    icon: SparklesIcon,
    title: "AI-Powered Questions",
    desc: "Questions generated in real-time based on your CV and job description. No templates, no repetition.",
  },
  {
    icon: MicrophoneIcon,
    title: "Voice Analysis",
    desc: "Advanced speech processing evaluates clarity, confidence, and communication depth beyond just words.",
  },
  {
    icon: BoltIcon,
    title: "Instant Feedback",
    desc: "Detailed performance breakdown with actionable insights delivered seconds after your session ends.",
  },
  {
    icon: BriefcaseIcon,
    title: "JD Matching",
    desc: "Smart alignment scoring between your experience and the role requirements — know your fit before applying.",
  },
  {
    icon: AdjustmentsHorizontalIcon,
    title: "Multi-Role Support",
    desc: "From HR screening to technical deep-dives, each interview type is calibrated for its purpose.",
  },
  {
    icon: ChartBarIcon,
    title: "Progress Tracking",
    desc: "Monitor your improvement across sessions with historical data and trend analysis.",
  },
];

export const STEPS = [
  {
    number: "01",
    title: "Upload Your CV",
    desc: "Drop your resume and let our AI extract your experience, skills, and background automatically.",
    icon: RocketLaunchIcon,
  },
  {
    number: "02",
    title: "Select a Job",
    desc: "Paste a job URL or enter the description manually. We analyze the role requirements instantly.",
    icon: RocketLaunchIcon,
  },
  {
    number: "03",
    title: "Start Interview",
    desc: "Speak naturally. The AI listens, adapts, and asks follow-up questions based on your answers.",
    icon: RocketLaunchIcon,
  },
  {
    number: "04",
    title: "Review Results",
    desc: "Get your full evaluation report with scores, strengths, red flags, and improvement suggestions.",
    icon: RocketLaunchIcon,
  },
];
