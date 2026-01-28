"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Users,
  Trash2,
  LogOut,
  Sparkles,
  ArrowRight,
  Loader2,
  Terminal,
  AlertTriangle,
  Share2,
  Copy,
  Check,
  BookOpen,
  Code2,
  ListChecks,
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

// Create Room Dialog
interface CreateRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  onRoomCreated?: (roomId: string) => void;
}

export function CreateRoomDialog({
  open,
  onOpenChange,
  userId,
  onRoomCreated,
}: CreateRoomDialogProps) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    setIsCreating(true);
    const roomId = Math.random().toString(36).substring(2, 9);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("rooms")
        .insert([{ id: roomId, created_by: userId }]);

      if (error) {
        toast.error("Failed to create room", { description: error.message });
        return;
      }

      toast.success("Room created successfully!", {
        description: `Room ID: ${roomId}`,
      });
      onRoomCreated?.(roomId);
      onOpenChange(false);
      router.push(`/room/${roomId}`);
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-slate-100">
        <DialogHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Plus className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-center">
            Create New Room
          </DialogTitle>
          <DialogDescription className="text-center text-slate-400">
            Create a collaborative coding room and invite your friends to
            practice together in real-time.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <Terminal className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">
                Collaborative Code Editor
              </p>
              <p className="text-xs text-slate-500">
                Real-time sync with your partners
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">
                AI-Powered Assistance
              </p>
              <p className="text-xs text-slate-500">
                Get hints and feedback as you code
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            onClick={handleCreate}
            disabled={isCreating}
            className="w-full h-12 bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Room...
              </>
            ) : (
              <>
                Create Room
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Join Room Dialog
interface JoinRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JoinRoomDialog({ open, onOpenChange }: JoinRoomDialogProps) {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async () => {
    const supabase = createClient();
    if (!roomId.trim()) {
      toast.error("Please enter a room ID");
      return;
    }
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", roomId.trim());
    if (error) {
      toast.error("Failed to join room", { description: error.message });
      return;
    }
    if (data.length === 0) {
      toast.error("Room not found");
      return;
    }

    setIsJoining(true);

    // Simulate a brief delay for UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    toast.success("Joining room...");
    onOpenChange(false);
    router.push(`/room/${roomId.trim()}`);
    setIsJoining(false);
    setRoomId("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-slate-100">
        <DialogHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <Users className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-center">
            Join a Room
          </DialogTitle>
          <DialogDescription className="text-center text-slate-400">
            Enter the room ID shared by your friend to join their coding
            session.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="roomId" className="text-slate-300">
              Room ID
            </Label>
            <Input
              id="roomId"
              placeholder="e.g. abc1234"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              className="h-12 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
            />
          </div>

          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-sm text-emerald-300">
              <span className="font-medium">Tip:</span> The room ID is a short
              code like &quot;abc1234&quot; that your friend can share with you.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            onClick={handleJoin}
            disabled={isJoining || !roomId.trim()}
            className="w-full h-12 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 disabled:opacity-50"
          >
            {isJoining ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Joining...
              </>
            ) : (
              <>
                Join Room
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              onOpenChange(false);
              setRoomId("");
            }}
            className="w-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Delete Room Dialog
interface DeleteRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomId: string;
  type?: "room" | "history";
  onDeleted?: () => void;
}

export function DeleteRoomDialog({
  open,
  onOpenChange,
  roomId,
  type = "room",
  onDeleted,
}: DeleteRoomDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const supabase = createClient();

    try {
      const table = type === "room" ? "rooms" : "practice_arena";
      const { error } = await supabase.from(table).delete().eq("id", roomId);

      if (error) {
        toast.error(`Failed to delete ${type}`, { description: error.message });
        return;
      }

      toast.success(
        `${type === "room" ? "Room" : "History item"} deleted successfully`,
      );
      onDeleted?.();
      onOpenChange(false);
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-slate-100">
        <DialogHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-linear-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/25">
            <Trash2 className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-center">
            Delete {type === "room" ? "Room" : "History"}
          </DialogTitle>
          <DialogDescription className="text-center text-slate-400">
            Are you sure you want to delete this{" "}
            {type === "room" ? "room" : "practice session"}? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-300">Warning</p>
              <p className="text-sm text-red-400/80 mt-1">
                {type === "room" ? (
                  <>
                    Room <span className="font-mono font-bold">{roomId}</span>{" "}
                    and all its questions will be permanently deleted.
                  </>
                ) : (
                  <>This practice session will be removed from your history.</>
                )}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full h-12 bg-linear-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold rounded-xl shadow-lg shadow-red-500/25 transition-all hover:shadow-red-500/40"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete {type === "room" ? "Room" : "History"}
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Logout Dialog
interface LogoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogout: () => void;
  userName?: string;
}

export function LogoutDialog({
  open,
  onOpenChange,
  onLogout,
  userName,
}: LogoutDialogProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await onLogout();
      toast.success("Logged out successfully", {
        description: "See you next time!",
      });
      onOpenChange(false);
      router.push("/login");
    } catch {
      toast.error("An unexpected error occurred during logout");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-slate-100">
        <DialogHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-linear-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-lg shadow-slate-500/25">
            <LogOut className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-center">
            Sign Out
          </DialogTitle>
          <DialogDescription className="text-center text-slate-400">
            {userName ? (
              <>
                Are you sure you want to sign out,{" "}
                <span className="text-white font-medium">{userName}</span>?
              </>
            ) : (
              "Are you sure you want to sign out?"
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
            <p className="text-sm text-slate-400">
              Your progress is saved. You can continue where you left off when
              you sign back in.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full h-12 bg-linear-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white font-semibold rounded-xl shadow-lg transition-all"
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing out...
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Share Room Dialog
interface ShareRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomId: string;
}

export function ShareRoomDialog({
  open,
  onOpenChange,
  roomId,
}: ShareRoomDialogProps) {
  const [copied, setCopied] = useState(false);

  const roomUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/room/${roomId}`
      : `/room/${roomId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!", {
        description: "Share it with your coding partner",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleCopyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID copied!");
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-slate-100">
        <DialogHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Share2 className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-center">
            Share Room
          </DialogTitle>
          <DialogDescription className="text-center text-slate-400">
            Invite your coding partner to join this room by sharing the link
            below.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-4">
          {/* Room ID Badge */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm text-slate-400">Room ID:</span>
            <button
              onClick={handleCopyRoomId}
              className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg font-mono text-sm text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              {roomId}
            </button>
          </div>

          {/* Link Input */}
          <div className="space-y-2">
            <Label htmlFor="roomLink" className="text-slate-300">
              Room Link
            </Label>
            <div className="flex gap-2">
              <Input
                id="roomLink"
                value={roomUrl}
                readOnly
                className="h-12 bg-slate-800 border-slate-700 text-slate-200 font-mono text-sm focus:border-blue-500 focus:ring-blue-500/20"
              />
              <Button
                onClick={handleCopy}
                className={`h-12 px-4 transition-all duration-300 ${
                  copied
                    ? "bg-green-600 hover:bg-green-500"
                    : "bg-blue-600 hover:bg-blue-500"
                } text-white rounded-xl`}
              >
                {copied ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Info Box */}
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
            <Users className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-300">
                Collaborate in Real-time
              </p>
              <p className="text-sm text-blue-400/80 mt-1">
                Anyone with this link can join and code together with you.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            onClick={handleCopy}
            className="w-full h-12 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Task Details Dialog
interface TaskDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: {
    title: string;
    description: string;
    starterCode?: string;
    requirements?: string[];
  } | null;
}

export function TaskDetailsDialog({
  open,
  onOpenChange,
  task,
}: TaskDetailsDialogProps) {
  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-slate-900 border-slate-800 text-slate-100 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-center">
            {task.title}
          </DialogTitle>
          <DialogDescription className="text-center text-slate-400">
            Review the details of your generated practice task.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-6">
          {/* Description */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Task Description</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <p className="text-slate-300 leading-relaxed">
                {task.description}
              </p>
            </div>
          </div>

          {/* Requirements */}
          {task.requirements && task.requirements.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <ListChecks className="w-4 h-4" />
                <span>Requirements</span>
              </div>
              <ul className="grid gap-2">
                {task.requirements.map((req, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 text-sm text-slate-300"
                  >
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Starter Code */}
          {task.starterCode && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <Code2 className="w-4 h-4" />
                <span>Starter Code</span>
              </div>
              <div className="relative group">
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm text-slate-300 overflow-x-auto">
                  <code>{task.starterCode}</code>
                </pre>
                <button
                  onClick={() => {
                    if (task.starterCode) {
                      navigator.clipboard.writeText(task.starterCode);
                      toast.success("Code copied to clipboard!");
                    }
                  }}
                  className="absolute top-3 right-3 p-2 rounded-lg bg-slate-800 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-white"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full h-11 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 transition-all"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
