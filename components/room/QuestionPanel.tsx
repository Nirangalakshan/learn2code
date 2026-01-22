"use client";

import React, { useState, useEffect } from "react";
import { Plus, List, BookOpen, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { createClient } from "@/lib/supabase/client";

export interface Question {
  id: string;
  title: string;
  description: string;
  starterCode: string;
}

interface QuestionPanelProps {
  roomId: string;
  onSelectQuestion: (q: Question) => void;
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
}

export function QuestionPanel({
  roomId,
  onSelectQuestion,
  questions,
  setQuestions,
}: QuestionPanelProps) {
  const supabase = createClient();
  const [view, setView] = useState<"current" | "list" | "create">("list");

  // Initialize currentQuestion with the first available question if any
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  useEffect(() => {
    if (questions.length > 0 && !currentQuestion) {
      setCurrentQuestion(questions[0]);
    }
  }, [questions, currentQuestion]);

  // Create Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCode, setNewCode] = useState("");

  const saveQuestion = async () => {
    if (!newTitle || !newDesc) return;

    const { data, error } = await supabase
      .from("questions")
      .insert({
        room_id: roomId,
        title: newTitle,
        description: newDesc,
        starter_code: newCode,
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving question:", error);
      return;
    }

    if (data) {
      const newQuestion: Question = {
        id: data.id,
        title: data.title,
        description: data.description,
        starterCode: data.starter_code,
      };
      setQuestions([...questions, newQuestion]);
      setView("list");
      setNewTitle("");
      setNewDesc("");
      setNewCode("");
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
        <h2 className="font-semibold text-sm uppercase tracking-wider text-gray-600 dark:text-gray-400">
          {view === "create"
            ? "New Problem"
            : view === "list"
              ? "Problem List"
              : "Current Problem"}
        </h2>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setView("current")}
            title="Current"
            disabled={!currentQuestion}
          >
            <BookOpen className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setView("list")}
            title="List"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setView("create")}
            title="Create New"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {view === "current" && (
          <div className="prose dark:prose-invert max-w-none">
            {currentQuestion ? (
              <>
                <h1 className="text-2xl font-bold mb-4">
                  {currentQuestion.title}
                </h1>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md border border-gray-100 dark:border-gray-800">
                  <ReactMarkdown>{currentQuestion.description}</ReactMarkdown>
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground py-10">
                <p>No problem selected.</p>
                <Button
                  variant="ghost"
                  onClick={() => setView("list")}
                  className="mt-2"
                >
                  View Problem List
                </Button>
              </div>
            )}
          </div>
        )}

        {view === "list" && (
          <div className="space-y-2">
            {questions.map((q) => (
              <Card
                key={q.id}
                className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors ${currentQuestion?.id === q.id ? "border-primary" : ""}`}
                onClick={() => {
                  setCurrentQuestion(q);
                  onSelectQuestion(q);
                  setView("current");
                }}
              >
                <CardContent className="p-4">
                  <h3 className="font-medium">{q.title}</h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {q.description.substring(0, 50)}...
                  </p>
                </CardContent>
              </Card>
            ))}
            {questions.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No questions yet.
              </p>
            )}
          </div>
        )}

        {view === "create" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                placeholder="e.g. Two Sum"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Description (Markdown supported)
              </label>
              <Textarea
                placeholder="Describe the problem..."
                rows={6}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Starter Code (Optional)
              </label>
              <Textarea
                placeholder="function solve() { ... }"
                rows={4}
                className="font-mono text-xs"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
              />
            </div>

            <Button className="w-full" onClick={saveQuestion}>
              <Save className="w-4 h-4 mr-2" />
              Save Question
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
