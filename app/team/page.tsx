import type { Metadata } from "next";
import { TEAMS } from "@/lib/data/teams";
import TeamsFilteredList from "@/components/team/TeamsFilteredList";
// import LoveClothAnimation from "@/components/TeamPage3dAnimations/LoveClothAnimation";
import BreathingSphere from "@/components/TeamPage3dAnimations/BreathingSphere";
export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the talented individuals behind Web & Coding Club NIT Patna. Explore our 7 specialized teams across Web Dev, Blockchain, Gen AI, ML, PR, Social Media, and Design.",
  alternates: {
    canonical: "/team",
  },
};

export default function TeamPage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#050505]">
      {/* Repeating Grunge Background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#050505]">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url("/images/bg/bg_grunge_2_1779981294962.png")',
            backgroundRepeat: "repeat",
          }}
        />
      </div>

      <div className="relative z-10">
       

        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="space-y-5">
                <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">
                  Discover the crew
                </p>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white">
                  Meet the teams powering WNCC NIT Patna.
                </h1>
                <p className="max-w-2xl text-base sm:text-lg leading-8 text-slate-300">
                  From Web Development, Blockchain, and Gen AI to Machine Learning, PR,
                  Social Media, and Design — each team blends strategy, creativity, and technical excellence to build meaningful digital experiences.
                </p>
              </div>

                   
                      <BreathingSphere
                        position={[0, 0, 12]}
                        gravity={[0, -40, 0]}
                        lanyardWidth={1.1}
                      />
                   
            </div>
          </div>
        </section>


//Sir ye wala animation check karna...if with certain modifications it can be implemented in the team page then we can add it otherwise we can remove it from the team page
{/* <LoveClothAnimation/> */}



        <section className="pb-24">
          <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-10">
            <div className="mb-10 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/70">
                Team roster
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-white">
                Choose a team to explore members and mission.
              </h2>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
              <TeamsFilteredList teams={TEAMS} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}