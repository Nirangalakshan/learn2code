"use client";

import Link from "next/link";
import {
  Flame,
  Target,
  Trophy,
  BookOpen,
  Code2,
  PlayCircle,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Sidebar - Simplified for Mockup */}
      <aside className="w-16 lg:w-60 fixed h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40 hidden md:flex flex-col items-center lg:items-stretch py-6 px-3 lg:px-4">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center">
            <Code2 className="w-4 h-4 text-white dark:text-gray-900" />
          </div>
          <span className="font-semibold text-lg hidden lg:block text-gray-900 dark:text-white">
            Learn2Code
          </span>
        </div>

        <nav className="space-y-1 flex-1 w-full">
          <SidebarItem icon={<BookOpen />} label="Dashboard" active />
          <SidebarItem icon={<Target />} label="Curriculum" />
          <SidebarItem icon={<Code2 />} label="Playground" />
          <SidebarItem icon={<Trophy />} label="Achievements" />
        </nav>

        <div className="mt-auto hidden lg:block">
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl">
            <p className="font-medium text-sm mb-1 text-gray-900 dark:text-white">
              Pro Plan
            </p>
            <p className="text-xs text-gray-500 mb-3">Unlock all challenges</p>
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
            >
              Upgrade
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-0 md:ml-16 lg:ml-60 p-6 lg:p-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Welcome back, Alex
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Let&apos;s continue your coding adventure
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
              <Flame className="w-4 h-4 text-gray-900 dark:text-white" />
              <span className="font-medium text-sm">12 days</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
              <Trophy className="w-4 h-4 text-gray-900 dark:text-white" />
              <span className="font-medium text-sm">2,450 XP</span>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Progress Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-gray-200 dark:border-gray-800 shadow-none bg-gray-900 dark:bg-gray-900 text-white overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <div>
                    <Badge className="mb-2 bg-white/10 text-white border-0 hover:bg-white/20">
                      Current Course
                    </Badge>
                    <h2 className="text-2xl font-semibold mb-1">
                      Intro to Python
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Section 3: Variables & Data Types
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center font-semibold text-lg">
                      75%
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Progress</span>
                    <span>12/16 Lessons</span>
                  </div>
                  <Progress value={75} className="h-2 bg-gray-800" />

                  <div className="pt-3">
                    <Link href="/lesson/python-101">
                      <Button className="bg-white text-gray-900 hover:bg-gray-100 font-medium">
                        Continue Learning{" "}
                        <PlayCircle className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Up Next
                </h3>
                <Link
                  href="#"
                  className="text-gray-500 hover:text-gray-900 dark:hover:text-white text-sm transition-colors"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                <LessonCard
                  title="Understanding Loops"
                  topic="Logic & Control Flow"
                  duration="15 min"
                  status="locked"
                />
                <LessonCard
                  title="Fun with Functions"
                  topic="Code Structure"
                  duration="20 min"
                  status="locked"
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Stats */}
            <Card className="border border-gray-200 dark:border-gray-800 shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  Your Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <StatItem
                  label="Lessons"
                  value="24"
                  icon={<BookOpen className="w-4 h-4" />}
                />
                <StatItem
                  label="Projects"
                  value="3"
                  icon={<Code2 className="w-4 h-4" />}
                />
                <StatItem
                  label="Level"
                  value="5"
                  icon={<Trophy className="w-4 h-4" />}
                />
                <StatItem
                  label="Hours"
                  value="12"
                  icon={<Clock className="w-4 h-4" />}
                />
              </CardContent>
            </Card>

            {/* Badges */}
            <Card className="border border-gray-200 dark:border-gray-800 shadow-none">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-medium">
                  Recent Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <BadgeItem icon="🐍" name="Python Init" />
                  <BadgeItem icon="🐛" name="Bug Hunter" />
                  <BadgeItem icon="🚀" name="First Launch" />
                </div>
              </CardContent>
            </Card>

            {/* Daily Challenge */}
            <Card className="border border-gray-200 dark:border-gray-800 shadow-none bg-white dark:bg-gray-900">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-0 hover:bg-gray-200 dark:hover:bg-gray-700">
                    Daily Challenge
                  </Badge>
                  <Clock className="w-4 h-4 text-gray-400" />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                  Fix the Bug
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  Find the error in the calculation function.
                </p>
                <Button className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 text-white">
                  Start Challenge
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={cn(
        "w-full flex items-center justify-center lg:justify-start gap-3 p-2.5 lg:px-3 rounded-lg transition-colors",
        active
          ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
          : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
      )}
    >
      <div className="w-5 h-5">{icon}</div>
      <span className="hidden lg:block text-sm">{label}</span>
    </button>
  );
}

function LessonCard({
  title,
  topic,
  duration,
  status,
}: {
  title: string;
  topic: string;
  duration: string;
  status?: string;
}) {
  return (
    <Card className="border border-gray-200 dark:border-gray-800 shadow-none hover:border-gray-300 dark:hover:border-gray-700 transition-colors cursor-pointer">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
            <PlayCircle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white text-sm">
              {title}
            </h4>
            <p className="text-xs text-gray-500">{topic}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-400 block mb-1">{duration}</span>
          {status === "locked" && (
            <Badge className="text-[10px] h-5 px-2 bg-gray-100 dark:bg-gray-800 text-gray-500 border-0">
              Locked
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function StatItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      <div className="flex items-center gap-2 mb-1.5 text-gray-500">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="font-semibold text-lg text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function BadgeItem({ icon, name }: { icon: string; name: string }) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <span className="text-sm">{icon}</span>
      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
        {name}
      </span>
    </div>
  );
}
