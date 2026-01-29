"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Code2,
  Sparkles,
  Zap,
  History,
  ArrowRight,
  Terminal,
  Trash2,
  Users,
  Plus,
  LogOut,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import {
  CreateRoomDialog,
  JoinRoomDialog,
  DeleteRoomDialog,
  LogoutDialog,
  TaskDetailsDialog,
} from "@/components/dashboard/RoomDialogs";

type SessionCardProps = {
  title: string;
  lang: string;
  difficulty: string;
  score: string;
  time: string;
  active?: boolean;
};

type HistoryItem = {
  id: string;
  created_at?: string;
  generated_task?: {
    title: string;
    description: string;
    starterCode: string;
    requirements: string[];
  };
  submit_solution?: {
    language: string;
    code: string;
    passed: boolean;
    feedback: string;
    submitted_at: string;
  };
};

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [rooms, setRooms] = useState<{ id: string; created_at?: string }[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<"room" | "history">("room");
  const [taskDetailsOpen, setTaskDetailsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<
    HistoryItem["generated_task"] | null
  >(null);
  const [selectedSolution, setSelectedSolution] = useState<
    HistoryItem["submit_solution"] | null
  >(null);

  useEffect(() => {
    if (!user) return;
    const fetchRooms = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("rooms")
        .select("*")
        .eq("created_by", user.id);

      if (data) {
        setRooms(
          data.sort(
            (a, b) =>
              new Date(b.created_at || 0).getTime() -
              new Date(a.created_at || 0).getTime(),
          ),
        );
      }
    };
    fetchRooms();

    const fetchHistory = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("practice_arena")
        .select("*")
        .eq("created_by", user.id);

      if (data) {
        setHistory(
          data.sort(
            (a, b) =>
              new Date(b.created_at || 0).getTime() -
              new Date(a.created_at || 0).getTime(),
          ),
        );
      }
    };
    fetchHistory();
  }, [user]);

  const handleDeleteClick = (id: string, type: "room" | "history" = "room") => {
    setRoomToDelete(id);
    setDeleteType(type);
    setDeleteDialogOpen(true);
  };

  const handleTaskClick = (item: HistoryItem) => {
    if (item.generated_task) {
      setSelectedTask(item.generated_task);
      setSelectedSolution(item.submit_solution || null);
      setTaskDetailsOpen(true);
    }
  };

  const handleDeleteSuccess = () => {
    if (roomToDelete) {
      if (deleteType === "room") {
        setRooms((prev) => prev.filter((r) => r.id !== roomToDelete));
      } else {
        setHistory((prev) => prev.filter((h) => h.id !== roomToDelete));
      }
      setRoomToDelete(null);
    }
  };

  const userInitials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() || "??";

  const userName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* Dialogs */}
      <CreateRoomDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        userId={user?.id || ""}
      />
      <JoinRoomDialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen} />
      <LogoutDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        onLogout={logout}
        userName={userName}
      />
      {roomToDelete && (
        <DeleteRoomDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          roomId={roomToDelete}
          type={deleteType}
          onDeleted={handleDeleteSuccess}
        />
      )}
      <TaskDetailsDialog
        open={taskDetailsOpen}
        onOpenChange={setTaskDetailsOpen}
        task={selectedTask || null}
        solution={selectedSolution || null}
      />

      {/* Navbar */}
      <nav className="border-b border-slate-800/60 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Learn2Code</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
              <Link href="#" className="text-white">
                Dashboard
              </Link>
              <Link
                href="/practice"
                className="hover:text-white transition-colors"
              >
                Practice
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                History
              </Link>
            </div>
            <div className="h-4 w-px bg-slate-800 hidden md:block" />
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-400 hidden sm:block">
                {userName}
              </span>
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                <span className="text-xs font-bold text-indigo-400">
                  {userInitials}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLogoutDialogOpen(true)}
                className="text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-8/9 mx-auto px-6 py-10 space-y-12">
        {/* Welcome Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-linear-to-br from-slate-900 via-slate-900 to-indigo-950/20 p-8 md:p-12">
          <div className="relative z-10 max-w-2xl space-y-6">
            <Badge
              variant="secondary"
              className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-3 py-1"
            >
              <Sparkles className="w-3 h-3 mr-2" />
              New: AI Coding Master 1.0
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Ready to master your <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-violet-400">
                Programming Skills?
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
              Practice with our advanced AI tutor. Get real-time feedback,
              hint-based learning, and adaptive difficulty levels.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/practice">
                <Button
                  size="lg"
                  className="h-12 px-8 rounded-full bg-white text-slate-950 hover:bg-slate-200 font-bold text-base shadow-xl shadow-white/5 transition-all hover:scale-105"
                >
                  Start Practice Session
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 rounded-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                View Past Performance
              </Button>
            </div>
          </div>

          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-20 w-80 h-80 bg-violet-500/10 blur-[80px] rounded-full pointer-events-none" />
          <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:block opacity-50 hover:grayscale transition-all duration-500">
            <Image
              src="/images/robot.png"
              alt="Robot"
              width={300}
              height={300}
              className="w-80 h-80 object-contain"
            />
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Practice Rooms"
            value={rooms.length.toString()}
            icon={<Users className="w-5 h-5 text-indigo-400" />}
            trend="Active coding spaces"
          />
          <StatCard
            label="AI Tasks"
            value={history.length.toString()}
            icon={<Zap className="w-5 h-5 text-yellow-400" />}
            trend="Generated sessions"
          />
          <StatCard
            label="Passed Tasks"
            value={history
              .filter((h) => h.submit_solution?.passed)
              .length.toString()}
            icon={<CheckCircle2 className="w-5 h-5 text-green-400" />}
            trend="Successful evaluations"
          />
          <StatCard
            label="Failed Tasks"
            value={history
              .filter((h) => h.submit_solution && !h.submit_solution.passed)
              .length.toString()}
            icon={<XCircle className="w-5 h-5 text-red-400" />}
            trend="Needs more practice"
          />
        </section>

        {/* Recent Sections similar to Bento Grid */}
        <section className=" gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 space-y-6 h-[calc(100vh-32rem)] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <History className="w-5 h-5 text-slate-500" />
                Recent Sessions
              </h2>
              <Button
                variant="outline"
                className="text-indigo-400 hover:text-indigo-300"
              >
                View All
              </Button>
            </div>
            {history.length === 0 ? (
              <div className="text-center p-4 border border-slate-800/50 rounded-xl bg-slate-900/20">
                <p className="text-slate-500 text-sm">
                  No AI generated tasks found!
                </p>
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
                  onClick={() => handleTaskClick(item)}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                      <Terminal className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">
                        {item.generated_task?.title || "Untitled Task"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString()
                          : "Just now"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteClick(item.id, "history")}
                      className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-400/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Rooms Management */}
          <div className="space-y-6 mt-8">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-500" />
              Your Rooms
            </h2>

            {/* Create / Join Card */}
            <div className="bg-linear-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/10 rounded-2xl p-6 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-semibold text-lg mb-2">
                  Collaborative Rooms
                </h3>
                <p className="text-sm text-slate-400 mb-4">
                  Create a room, invite friends, and solve problems together in
                  real-time.
                </p>
                <div className="space-y-2">
                  <Button
                    onClick={() => setCreateDialogOpen(true)}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Room
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
                    onClick={() => setJoinDialogOpen(true)}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Join Room
                  </Button>
                </div>
              </div>
            </div>

            {/* Recently Created Rooms List */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                Recently Created
              </h3>
              {rooms.length === 0 ? (
                <div className="text-center p-4 border border-slate-800/50 rounded-xl bg-slate-900/20">
                  <p className="text-slate-500 text-sm">No rooms found</p>
                </div>
              ) : (
                rooms.map((room) => (
                  <div
                    key={room.id}
                    className="group flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                        <Terminal className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate">
                          {room.id}
                        </p>
                        <p className="text-xs text-slate-500">
                          {room.created_at
                            ? new Date(room.created_at).toLocaleDateString()
                            : "Just now"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <Link href={`/room/${room.id}`}>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteClick(room.id)}
                        className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-400/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  trend,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
}) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-colors group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-800 rounded-lg group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-slate-500 text-sm font-medium">{label}</p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
        <p className="text-xs text-indigo-400/80 font-medium pt-1">{trend}</p>
      </div>
    </div>
  );
}

function SessionCard({
  title,
  lang,
  difficulty,
  score,
  time,
  active,
}: SessionCardProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-5 rounded-2xl border transition-all",
        active
          ? "bg-indigo-500/5 border-indigo-500/20 shadow-lg shadow-indigo-900/10"
          : "bg-slate-900/50 border-slate-800 hover:border-slate-700",
      )}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg",
            lang === "Python"
              ? "bg-blue-500/10 text-blue-400"
              : lang === "TypeScript"
                ? "bg-blue-600/10 text-blue-500"
                : "bg-yellow-400/10 text-yellow-400",
          )}
        >
          {lang === "Python" ? "Py" : lang === "TypeScript" ? "TS" : "JS"}
        </div>
        <div>
          <h4 className="font-semibold text-slate-200">{title}</h4>
          <div className="flex items-center gap-2 mt-1">
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] h-5 px-1.5 border",
                difficulty === "Easy"
                  ? "border-green-800 text-green-400 bg-green-900/10"
                  : difficulty === "Medium"
                    ? "border-yellow-800 text-yellow-400 bg-yellow-900/10"
                    : "border-red-800 text-red-400 bg-red-900/10",
              )}
            >
              {difficulty}
            </Badge>
            <span className="text-xs text-slate-500">• {time}</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <span
          className={cn(
            "text-sm font-bold block",
            active ? "text-indigo-400" : "text-white",
          )}
        >
          {score}
        </span>
        {active && (
          <span className="text-[10px] text-indigo-400/70 uppercase tracking-wider font-bold animate-pulse">
            Running
          </span>
        )}
      </div>
    </div>
  );
}
