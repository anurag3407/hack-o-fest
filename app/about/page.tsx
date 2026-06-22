import type { Metadata } from "next";
import About from "@/components/about/About";
import {Footer} from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "About // HACK-O-FEST",
  description:
    "HACK-O-FEST is a 72-hour hackathon by the Web & Coding Club of NIT Patna, bringing students together to design, build, and ship real products.",
  openGraph: {
    title: "About // HACK-O-FEST",
    description:
      "A 72-hour hackathon for students who would rather build than talk about building.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "About // HACK-O-FEST",
    description:
      "A 72-hour hackathon for students who would rather build than talk about building.",
  },
};

export default function AboutPage() {
  return (
    <main className="relative bg-void min-h-screen overflow-hidden">
      <About />
      <Footer />
    </main>
  );
}
