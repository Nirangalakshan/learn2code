"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Gamepad2, GraduationCap, Briefcase, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ageGroups = [
  {
    id: "kids",
    range: "11–13",
    label: "Just for Fun",
    icon: <Gamepad2 className="w-7 h-7" />,
    description: "Learn with games and colorful blocks.",
  },
  {
    id: "students",
    range: "14–17",
    label: "School & Future",
    icon: <GraduationCap className="w-7 h-7" />,
    description: "Prepare for computer science classes.",
  },
  {
    id: "adults",
    range: "18+",
    label: "Career Switch",
    icon: <Briefcase className="w-7 h-7" />,
    description: "Professional skills for the real world.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  const handleContinue = () => {
    if (selected) {
      router.push(`/signup?path=${selected}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-3xl space-y-10">
        <div className="text-center space-y-3">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white"
          >
            Choose your path
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 dark:text-gray-400"
          >
            We&apos;ll customize the experience just for you.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ageGroups.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                onClick={() => setSelected(group.id)}
                className={cn(
                  "cursor-pointer relative overflow-hidden rounded-xl border-2 transition-all duration-200 h-full",
                  selected === group.id
                    ? "bg-white dark:bg-gray-900 border-gray-900 dark:border-white"
                    : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                )}
              >
                <div className="p-6 flex flex-col items-center text-center gap-4">
                  <div
                    className={cn(
                      "p-3 rounded-xl transition-colors",
                      selected === group.id
                        ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                    )}
                  >
                    {group.icon}
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-0.5">
                      {group.range}
                    </h3>
                    <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {group.label}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {group.description}
                    </p>
                  </div>

                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                      selected === group.id
                        ? "border-gray-900 dark:border-white bg-gray-900 dark:bg-white"
                        : "border-gray-300 dark:border-gray-600"
                    )}
                  >
                    {selected === group.id && (
                      <div className="w-2 h-2 bg-white dark:bg-gray-900 rounded-full" />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="flex justify-center h-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: selected ? 1 : 0, y: selected ? 0 : 10 }}
        >
          <Button
            disabled={!selected}
            onClick={handleContinue}
            size="lg"
            className="px-8 rounded-full h-12 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 text-white font-medium"
          >
            Continue <ChevronRight className="ml-1 w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
