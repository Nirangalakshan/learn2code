"use client";

import type React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { MoveRight, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Character {
  char: string;
  x: number;
  y: number;
  speed: number;
}

class TextScramble {
  el: HTMLElement;
  chars: string;
  queue: Array<{
    from: string;
    to: string;
    start: number;
    end: number;
    char?: string;
  }>;
  frame: number;
  frameRequest: number;
  resolve: (value: void | PromiseLike<void>) => void;

  constructor(el: HTMLElement) {
    this.el = el;
    this.chars = "!<>-_\\/[]{}—=+*^?#";
    this.queue = [];
    this.frame = 0;
    this.frameRequest = 0;
    this.resolve = () => {};
    this.update = this.update.bind(this);
  }

  setText(newText: string) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise<void>((resolve) => (this.resolve = resolve));
    this.queue = [];

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = "";
    let complete = 0;

    for (let i = 0, n = this.queue.length; i < n; i++) {
      const { from, to, start, end } = this.queue[i];
      let { char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }

    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}

const ScrambledTitle: React.FC = () => {
  const elementRef = useRef<HTMLHeadingElement>(null);
  const scramblerRef = useRef<TextScramble | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (elementRef.current && !initializedRef.current) {
      initializedRef.current = true;
      scramblerRef.current = new TextScramble(elementRef.current);

      const phrases = [
        "Learn to Code",
        "Build Projects",
        "Solve Problems",
        "Create Apps",
        "Master Skills",
        "Shape Your Future",
      ];

      let counter = 0;
      const next = () => {
        if (scramblerRef.current) {
          scramblerRef.current.setText(phrases[counter]).then(() => {
            setTimeout(next, 2000);
          });
          counter = (counter + 1) % phrases.length;
        }
      };

      next();
    }
  }, []);

  return (
    <h1
      ref={elementRef}
      className="text-white text-4xl md:text-6xl lg:text-7xl font-bold tracking-wider text-center"
      style={{ fontFamily: "monospace" }}
    >
      Learn2Code
    </h1>
  );
};

// Navbar Component
const Navbar: React.FC = () => {
  return (
    <nav className="absolute top-0 left-0 right-0 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-50">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
          <Code2 className="text-emerald-400 w-5 h-5" />
        </div>
        <span className="text-xl font-semibold text-white">Learn2Code</span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
        <Link href="#features" className="hover:text-white transition-colors">
          Features
        </Link>
        <Link href="#curriculum" className="hover:text-white transition-colors">
          Curriculum
        </Link>
        <Link href="#pricing" className="hover:text-white transition-colors">
          Pricing
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="text-sm font-medium text-gray-300 hover:text-white transition-colors hidden sm:block"
        >
          Sign in
        </Link>
        <Link href="/onboarding">
          <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-medium rounded-full px-5 h-9 text-sm">
            Get Started <MoveRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
    </nav>
  );
};

// CTA Section inside the hero
const HeroCTA: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-6 mt-6">
      <p className="text-gray-400 text-center text-base md:text-lg max-w-xl px-4">
        A beginner-friendly platform designed for everyone from 11 to 100. Start
        your journey with fun, interactive lessons.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link href="/onboarding">
          <Button
            size="lg"
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-full px-8 h-12 text-base transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25"
          >
            Start Learning Free
          </Button>
        </Link>
        <Link href="#curriculum">
          <Button
            variant="outline"
            size="lg"
            className="border-gray-700 text-gray-300 hover:bg-white/5 hover:text-white rounded-full px-8 h-12 text-base font-medium transition-all duration-300"
          >
            View Curriculum
          </Button>
        </Link>
      </div>
    </div>
  );
};

const RainingLetters: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [activeIndices, setActiveIndices] = useState<Set<number>>(new Set());

  const createCharacters = useCallback(() => {
    const allChars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    const charCount = 200;
    const newCharacters: Character[] = [];

    for (let i = 0; i < charCount; i++) {
      newCharacters.push({
        char: allChars[Math.floor(Math.random() * allChars.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        speed: 0.05 + Math.random() * 0.15,
      });
    }

    return newCharacters;
  }, []);

  useEffect(() => {
    setCharacters(createCharacters());
  }, [createCharacters]);

  useEffect(() => {
    const updateActiveIndices = () => {
      const newActiveIndices = new Set<number>();
      const numActive = Math.floor(Math.random() * 8) + 10;
      for (let i = 0; i < numActive; i++) {
        newActiveIndices.add(Math.floor(Math.random() * characters.length));
      }
      setActiveIndices(newActiveIndices);
    };

    const flickerInterval = setInterval(updateActiveIndices, 150);
    return () => clearInterval(flickerInterval);
  }, [characters.length]);

  useEffect(() => {
    let animationFrameId: number;

    const updatePositions = () => {
      setCharacters((prevChars) =>
        prevChars.map((char) => ({
          ...char,
          y: char.y + char.speed,
          ...(char.y >= 100 && {
            y: -5,
            x: Math.random() * 100,
            char: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"[
              Math.floor(
                Math.random() *
                  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"
                    .length,
              )
            ],
          }),
        })),
      );
      animationFrameId = requestAnimationFrame(updatePositions);
    };

    animationFrameId = requestAnimationFrame(updatePositions);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/80 z-10 pointer-events-none" />

      {/* Main Content */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-gray-400 text-sm font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Start learning today</span>
        </div>
        <ScrambledTitle />
        <HeroCTA />
      </div>

      {/* Raining Characters */}
      {characters.map((char, index) => (
        <span
          key={index}
          className={`absolute transition-colors duration-150 select-none ${
            activeIndices.has(index)
              ? "text-emerald-400 z-5 font-bold"
              : "text-gray-400 font-medium"
          }`}
          style={{
            left: `${char.x}%`,
            top: `${char.y}%`,
            transform: `translate(-50%, -50%) ${activeIndices.has(index) ? "scale(1.5)" : "scale(1)"}`,
            textShadow: activeIndices.has(index)
              ? "0 0 12px rgba(16, 185, 129, 1), 0 0 24px rgba(16, 185, 129, 0.6), 0 0 36px rgba(16, 185, 129, 0.3)"
              : "0 0 4px rgba(148, 163, 184, 0.3)",
            opacity: activeIndices.has(index) ? 1 : 0.65,
            transition:
              "color 0.15s, transform 0.15s, text-shadow 0.15s, opacity 0.15s",
            willChange: "transform, top",
            fontSize: activeIndices.has(index) ? "1.8rem" : "1.4rem",
          }}
        >
          {char.char}
        </span>
      ))}

      <style jsx global>{`
        .dud {
          color: #10b981;
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
};

export default RainingLetters;
