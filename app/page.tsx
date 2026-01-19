"use client";

import { Code2, Users, BookOpen, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import RainingLetters from "@/components/ui/modern-animated-hero-section";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Animated Hero Section with Navbar included */}
      <RainingLetters />

      {/* Trust Section */}
      <section
        id="features"
        className="w-full bg-gray-950 border-y border-gray-800 py-20"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-white mb-3">
              Why learn with us?
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto">
              We make coding feel simple and achievable. Built for students,
              designed for success.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <TrustCard
              icon={<Users className="w-5 h-5 text-emerald-500" />}
              title="Beginner Friendly"
              desc="No prior experience needed. We start from absolute zero."
            />
            <TrustCard
              icon={<BookOpen className="w-5 h-5 text-emerald-500" />}
              title="Step-by-Step"
              desc="Bite-sized lessons that never feel overwhelming."
            />
            <TrustCard
              icon={<Code2 className="w-5 h-5 text-emerald-500" />}
              title="Real Practice"
              desc="Write actual code in our browser-based editor."
            />
            <TrustCard
              icon={<Star className="w-5 h-5 text-emerald-500" />}
              title="Track Progress"
              desc="See your improvement and stay motivated."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 border-t border-gray-800 bg-black">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p>© 2026 Learn2Code. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function TrustCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Card className="border border-gray-800 shadow-none bg-gray-900/50 backdrop-blur-sm hover:border-emerald-500/50 hover:bg-gray-800/50 transition-all duration-300">
      <CardContent className="p-5">
        <div className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="font-medium text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
      </CardContent>
    </Card>
  );
}
