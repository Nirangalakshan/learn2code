"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Play,
  RotateCcw,
  Lightbulb,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function LessonPage() {
  const [code, setCode] = useState(`name = "Alex"
print("Hello " + name)`);

  const [step, setStep] = useState(1);
  const [output, setOutput] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [showHint, setShowHint] = useState(false);

  const handleRun = () => {
    // Simulating running code
    if (code.includes('print("Hello " + name)')) {
      setOutput("Hello Alex");
      setStatus("success");
    } else {
      setOutput("SyntaxError: Unexpected token");
      setStatus("error");
    }
  };

  const handleNext = () => {
    setStep((prev) => prev + 1);
    setStatus("idle");
    setOutput(null);
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-950 font-sans overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 w-8 h-8"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-sm font-medium text-gray-900 dark:text-white">
              <span className="text-gray-500 dark:text-gray-400">
                Lesson 1:
              </span>{" "}
              Your First Program
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={cn(
                  "w-6 h-1 rounded-full",
                  i <= step
                    ? "bg-gray-900 dark:bg-white"
                    : "bg-gray-200 dark:bg-gray-800"
                )}
              />
            ))}
          </div>
          <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-0">
            100 XP
          </Badge>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Lesson Content */}
        <div className="w-1/3 min-w-[320px] border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-6 overflow-y-auto">
          <div className="space-y-5">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Variables make things easy
            </h2>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
              In coding, we store information in boxes called{" "}
              <span className="text-gray-900 dark:text-white font-medium bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                variables
              </span>
              . Think of it like labeling a box &quot;Toys&quot; so you know
              what&apos;s inside!
            </p>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2 text-sm">
                <Lightbulb className="w-4 h-4" /> Concept
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                In Python, we create a variable by giving it a name and using
                the{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-900 dark:text-white text-xs">
                  =
                </code>{" "}
                sign.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                Your Mission:
              </h3>
              <ul className="space-y-2.5">
                <li className="flex gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="mt-0.5 w-5 h-5 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center shrink-0 text-xs">
                    1
                  </div>
                  <span>
                    Create a variable called{" "}
                    <code className="text-gray-900 dark:text-white font-medium">
                      name
                    </code>
                  </span>
                </li>
                <li className="flex gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="mt-0.5 w-5 h-5 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center shrink-0 text-xs">
                    2
                  </div>
                  <span>Set it equal to your name (in quotes!)</span>
                </li>
                <li className="flex gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="mt-0.5 w-5 h-5 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center shrink-0 text-xs">
                    3
                  </div>
                  <span>Print a greeting using that variable.</span>
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                className="w-full justify-between text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setShowHint(!showHint)}
              >
                <span>Stuck? Get a Hint</span>
                <Lightbulb className="w-4 h-4" />
              </Button>
              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-600 dark:text-gray-400 border-l-2 border-gray-400 dark:border-gray-500">
                      Try typing:{" "}
                      <code className="text-gray-900 dark:text-white">
                        name = &quot;YourName&quot;
                      </code>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right: Editor */}
        <div className="flex-1 flex flex-col bg-gray-900">
          {/* Editor Toolbar */}
          <div className="h-10 border-b border-gray-800 flex items-center justify-between px-4 bg-gray-900">
            <span className="text-xs text-gray-500 font-mono">main.py</span>
            <div className="flex gap-2">
              <button
                onClick={() => setCode("")}
                className="p-1.5 hover:bg-gray-800 rounded text-gray-500 hover:text-gray-300 transition-colors"
                title="Reset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Code Area */}
          <div className="flex-1 p-4 font-mono text-sm relative">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full bg-transparent text-gray-300 resize-none focus:outline-none font-mono leading-relaxed"
              spellCheck={false}
            />
          </div>

          {/* Output Area */}
          <div className="h-[28%] bg-gray-950 border-t border-gray-800 flex flex-col">
            <div className="h-9 border-b border-gray-800 px-4 flex items-center justify-between bg-gray-900">
              <span className="text-xs font-medium text-gray-500">
                Console Output
              </span>
              {status !== "idle" && (
                <Badge
                  className={cn(
                    "h-5 text-[10px] px-2 border-0",
                    status === "success"
                      ? "bg-gray-800 text-white"
                      : "bg-red-900/50 text-red-400"
                  )}
                >
                  {status === "success" ? "Passed" : "Failed"}
                </Badge>
              )}
            </div>
            <div className="p-4 font-mono text-sm flex-1 overflow-auto">
              {output ? (
                <span
                  className={status === "error" ? "text-red-400" : "text-white"}
                >
                  {output}
                </span>
              ) : (
                <span className="text-gray-600 italic">
                  Run your code to see output...
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-gray-800 bg-gray-900 flex justify-end gap-3">
            {status === "success" ? (
              <Button
                onClick={handleNext}
                className="bg-white text-gray-900 hover:bg-gray-100"
              >
                Next Lesson <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleRun}
                className="bg-white text-gray-900 hover:bg-gray-100 min-w-[110px]"
              >
                <Play className="w-4 h-4 mr-1.5 fill-current" /> Run Code
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
