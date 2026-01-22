"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CodeEditor } from "@/components/room/CodeEditor";
import { QuestionPanel, Question } from "@/components/room/QuestionPanel";
import { Button } from "@/components/ui/button";
import { Share2, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;
  const supabase = createClient();

  // Shared State
  const [currentCode, setCurrentCode] = useState(
    "// Select a question to load starter code",
  );
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  const handleQuestionSelect = (q: Question) => {
    setActiveQuestion(q);
    // Only update code if it's the default or empty, ideally warn user
    if (
      confirm(
        "Load starter code for this question? This will overwrite your current code.",
      )
    ) {
      setCurrentCode(q.starterCode || "// No starter code provided");
    }
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("room_id", roomId);
      if (error) {
        console.error("Error fetching questions:", error);
        return;
      }
      if (data) {
        const mappedQuestions = data.map(
          (q: {
            id: string;
            title: string;
            description: string;
            starter_code: string;
          }) => ({
            id: q.id,
            title: q.title,
            description: q.description,
            starterCode: q.starter_code,
          }),
        );
        setQuestions(mappedQuestions);
      }
    };
    fetchQuestions();
  }, [roomId, supabase]);

  const copyInviteLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    // Simple alert if no toast
    alert("Room link copied to clipboard!");
  };

  return (
    <div className="h-screen w-full bg-background flex flex-col overflow-hidden">
      {/* Top Bar */}
      <header className="h-14 border-b px-4 flex items-center justify-between bg-card shrink-0">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Exit Room
          </Button>
          <div className="h-6 w-px bg-border mx-2" />
          <h1 className="font-semibold text-sm">
            Practice Room:{" "}
            <span className="font-mono text-muted-foreground">{roomId}</span>
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" onClick={copyInviteLink}>
            <Share2 className="w-4 h-4 mr-2" />
            Invite Partner
          </Button>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
            You
          </div>
        </div>
      </header>

      {/* Main Workspace - Simplified 2 Column Layout */}
      <main className="flex flex-1 overflow-hidden">
        {/* Left: Questions (Fixed Width or Percentage) */}
        <section className="w-1/3 min-w-[300px] border-r border-border h-full overflow-hidden">
          <QuestionPanel
            roomId={roomId}
            onSelectQuestion={handleQuestionSelect}
            questions={questions}
            setQuestions={setQuestions}
          />
        </section>

        {/* Right: Code Editor (Expands) */}
        <section className="flex-1 h-full overflow-hidden bg-[#1e1e1e]">
          <CodeEditor
            roomId={roomId}
            initialCode={currentCode}
            key={activeQuestion?.id || "default"}
            onCodeChange={setCurrentCode}
          />
        </section>
      </main>
    </div>
  );
}
