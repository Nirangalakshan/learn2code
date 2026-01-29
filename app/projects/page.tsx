"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Calculator,
  Gamepad2,
  Clock,
  Dice5,
  Code,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

const projects = [
  {
    id: "calculator",
    title: "Simple Calculator",
    desc: "Build a working calculator that adds, subtracts, and multiplies.",
    icon: <Calculator className="w-5 h-5" />,
    difficulty: "Easy",
    time: "30 min",
    progress: 0,
    locked: false,
  },
  {
    id: "guess-number",
    title: "Guess the Number",
    desc: "Create a game where the computer picks a random number.",
    icon: <Dice5 className="w-5 h-5" />,
    difficulty: "Medium",
    time: "45 min",
    progress: 30,
    locked: false,
  },
  {
    id: "todo-list",
    title: "To-Do List App",
    desc: "A fully functional task manager with add/delete features.",
    icon: <Code className="w-5 h-5" />,
    difficulty: "Hard",
    time: "1 hour",
    progress: 0,
    locked: true,
  },
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 md:p-10">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white pl-0"
            >
              <ArrowLeft className="mr-2 w-4 h-4" /> Back
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-1">
              Mini Projects
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Build real software. Add these to your portfolio!
            </p>
          </div>
          <div className="flex gap-2">
            <Badge
              variant="outline"
              className="px-3 py-1 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
            >
              Javascript
            </Badge>
            <Badge
              variant="outline"
              className="px-3 py-1 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
            >
              Python
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`border border-gray-200 dark:border-gray-800 shadow-none bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700 transition-colors h-full flex flex-col ${
                project.locked ? "opacity-60" : ""
              }`}
            >
              <div className="h-28 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center text-gray-600 dark:text-gray-400">
                  {project.icon}
                </div>
              </div>

              <CardContent className="p-5 flex-1 flex flex-col">
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {project.title}
                    </h3>
                    {project.locked && (
                      <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-500 border-0 text-xs">
                        Locked
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm">{project.desc}</p>
                </div>

                <div className="mt-auto space-y-4">
                  <div className="flex gap-3 text-xs text-gray-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Gamepad2 className="w-3 h-3" /> {project.difficulty}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {project.time}
                    </span>
                  </div>

                  {project.progress > 0 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-1" />
                    </div>
                  )}

                  <Button
                    className={`w-full ${
                      project.locked
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                        : "bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 text-white"
                    }`}
                    disabled={project.locked}
                  >
                    {project.progress > 0
                      ? "Continue Building"
                      : "Start Project"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
