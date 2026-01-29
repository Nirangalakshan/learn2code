"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Play,
  Sparkles,
  Bot,
  User,
  Loader2,
  Settings,
  ChevronDown,
  Code2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Trophy,
  Zap,
  Terminal as TerminalIcon,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Editor from "@monaco-editor/react";
import {
  generateQuestionAction,
  checkAnswerAction,
  getHintAction,
} from "../api/questions/actions";
import { createClient } from "@/lib/supabase/client";

type Message = {
  id: string;
  role: "ai" | "user";
  content: string;
  type?: "text" | "success" | "error" | "hint";
};

type Question = {
  title: string;
  description: string;
  starterCode: string;
  requirements: string[];
};

const LANGUAGES = [
  {
    id: "python",
    name: "Python",
    icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg",
  },
  {
    id: "javascript",
    name: "JavaScript",
    icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg",
  },
  {
    id: "typescript",
    name: "TypeScript",
    icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg",
  },
  {
    id: "react",
    name: "React",
    icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg",
  },
  {
    id: "java",
    name: "Java",
    icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg",
  },
  {
    id: "cpp",
    name: "C++",
    icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/cplusplus/cplusplus-original.svg",
  },
];

const DIFFICULTIES = [
  { id: "Easy", color: "text-green-400 bg-green-400/10 border-green-400/20" },
  {
    id: "Medium",
    color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  },
  { id: "Hard", color: "text-red-400 bg-red-400/10 border-red-400/20" },
];

export default function PracticeArena() {
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[0]);
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [code, setCode] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content:
        "Ready to ace your interview? Pick a topic, language, and difficulty level!",
    },
  ]);
  const [isChecking, setIsChecking] = useState(false);
  const [showLangSelector, setShowLangSelector] = useState(false);
  const [showDiffSelector, setShowDiffSelector] = useState(false);
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleGenerateQuestion = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "user",
        content: `Generate a ${difficulty.id} ${topic} question in ${language.name}`,
      },
    ]);

    try {
      const result = await generateQuestionAction(
        topic,
        difficulty.id,
        language.name,
      );

      // Attempt to parse the JSON from the AI response
      try {
        // Simple extraction of JSON from potential markdown blocks
        const jsonMatch = result.rawResponse.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : result.rawResponse;
        const parsed = JSON.parse(jsonStr);

        setActiveQuestion(parsed);
        setCode(parsed.starterCode || "");

        // Save to Supabase
        try {
          const supabase = createClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (user) {
            const { data, error } = await supabase
              .from("practice_arena")
              .insert({
                created_by: user.id,
                generated_task: parsed,
              })
              .select()
              .single();

            if (data && !error) {
              setSessionId(data.id);
            } else if (error) {
              console.error("Supabase Error:", error);
            }
          }
        } catch (supabaseErr) {
          console.error("Failed to save session to Supabase:", supabaseErr);
        }

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "ai",
            content: `Great! I've prepared a ${difficulty.id} level problem on "${topic}" for you. You can find the description and constraints on the left. Good luck!`,
          },
        ]);
      } catch (e) {
        // Fallback if parsing fails - just show the raw response
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "ai",
            content: result.rawResponse,
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content:
            "Sorry, I couldn't generate a question right now. Please try again.",
          type: "error",
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setIsTerminalOpen(true);
    setOutput("Running code...\n");

    try {
      // Map language names to Piston language identifiers
      const langMapping: Record<string, string> = {
        python: "python",
        javascript: "javascript",
        typescript: "typescript",
        react: "typescript",
        java: "java",
        cpp: "cpp",
        c: "c",
        "typescript-react": "typescript",
      };

      const pistonLang = langMapping[language.id] || language.id;

      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: pistonLang,
          version: "*",
          files: [{ content: code }],
        }),
      });

      const data = await response.json();

      if (data.run) {
        setOutput(
          data.run.output || "Program executed successfully with no output.",
        );
      } else {
        setOutput("Error: " + (data.message || "Unknown execution error"));
      }
    } catch (error) {
      setOutput("Execution failed: " + String(error));
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!activeQuestion) return;

    setIsChecking(true);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "user",
        content: "Submitting my solution...",
      },
    ]);

    try {
      const result = await checkAnswerAction(
        activeQuestion.description,
        code,
        language.name,
      );
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: result.feedback,
          type: result.passed ? "success" : "error",
        },
      ]);

      if (result.suggestions && result.suggestions.length > 0) {
        const suggestionsText =
          "Suggestions:\n" +
          result.suggestions.map((s: string) => "- " + s).join("\n");
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 2).toString(),
            role: "ai",
            content: suggestionsText,
            type: "hint",
          },
        ]);
      }

      // Save to Supabase
      if (sessionId) {
        try {
          const supabase = createClient();
          const { error } = await supabase
            .from("practice_arena")
            .update({
              submit_solution: {
                code,
                language: language.id,
                passed: result.passed,
                feedback: result.feedback,
                submitted_at: new Date().toISOString(),
              },
              updated_at: new Date().toISOString(),
            })
            .eq("id", sessionId);

          if (error) {
            console.error("Supabase Update Error:", error);
          }
        } catch (supabaseErr) {
          console.error("Failed to update session in Supabase:", supabaseErr);
        }
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: "Something went wrong while checking your code.",
          type: "error",
        },
      ]);
    } finally {
      setIsChecking(false);
    }
  };

  const handleAskHelp = async () => {
    if (!activeQuestion) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "user",
        content: "I'm stuck, can I get a hint?",
      },
    ]);

    try {
      const result = await getHintAction(
        activeQuestion.title,
        code,
        "User is stuck and needs a hint.",
      );
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: result.hint,
          type: "hint",
        },
      ]);
    } catch (err) {
      // Fallback handled in action
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden selection:bg-indigo-500/30">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-white tracking-tight text-lg">
                Practice Arena
              </h1>
            </div>
            <Badge
              variant="outline"
              className="hidden md:flex bg-slate-800/50 border-slate-700 text-slate-400 gap-1.5 ml-2"
            >
              <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span>AI Powered</span>
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Difficulty Selector */}
          <div className="relative">
            <button
              onClick={() => setShowDiffSelector(!showDiffSelector)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 border rounded-lg transition-all duration-200 text-sm font-medium",
                difficulty.color,
              )}
            >
              <span>{difficulty.id}</span>
              <ChevronDown className="w-4 h-4 opacity-50" />
            </button>
            <AnimatePresence>
              {showDiffSelector && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-32 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col p-1.5 gap-1"
                >
                  {DIFFICULTIES.map((diff) => (
                    <button
                      key={diff.id}
                      onClick={() => {
                        setDifficulty(diff);
                        setShowDiffSelector(false);
                      }}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-lg text-xs font-medium transition-all hover:bg-slate-800",
                        diff.color,
                      )}
                    >
                      {diff.id}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangSelector(!showLangSelector)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg hover:border-slate-600 hover:bg-slate-700/50 transition-all text-sm font-medium text-slate-200"
            >
              <Image
                src={language.icon}
                alt={language.name}
                width={20}
                height={20}
                className="w-5 h-5 object-contain"
              />
              <span className="hidden sm:inline">{language.name}</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            <AnimatePresence>
              {showLangSelector && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col p-1"
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => {
                        setLanguage(lang);
                        setShowLangSelector(false);
                      }}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-colors",
                        language.id === lang.id
                          ? "bg-indigo-600 text-white"
                          : "text-slate-300 hover:bg-slate-800",
                      )}
                    >
                      <Image
                        src={lang.icon}
                        alt={lang.name}
                        width={20}
                        height={20}
                        className="w-5 h-5 object-contain"
                      />
                      {lang.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Interaction & Specs */}
        <div className="w-full md:w-[450px] lg:w-[500px] flex flex-col border-r border-slate-800 bg-slate-950/50 backdrop-blur-sm z-10 transition-all duration-300 absolute md:relative h-full">
          <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {/* Topic Input - Always visible if no active question or persisted */}
            <div className="space-y-4 bg-slate-900/50 border border-slate-800/50 p-5 rounded-2xl shadow-sm ring-1 ring-white/5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">
                  Setup Interview
                </label>
                {activeQuestion && (
                  <Badge
                    variant="secondary"
                    className="bg-green-500/10 text-green-400 border-0 text-[10px]"
                  >
                    Active Session
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Topic e.g. Dynamic Programming, API..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600 transition-all"
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleGenerateQuestion()
                    }
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <span className="text-[10px] text-slate-600 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">
                      RET
                    </span>
                  </div>
                </div>
                <Button
                  onClick={handleGenerateQuestion}
                  disabled={isGenerating || !topic.trim()}
                  className="h-auto px-4 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 rounded-xl transition-all"
                >
                  {isGenerating ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>

            {/* Active Question Display */}
            <AnimatePresence mode="wait">
              {activeQuestion && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                      <Badge
                        variant="outline"
                        className={cn(
                          "border bg-transparent",
                          difficulty.color,
                        )}
                      >
                        {difficulty.id}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 pr-12 leading-snug">
                        {activeQuestion.title}
                      </h3>
                      <p className="text-slate-400 leading-relaxed text-sm whitespace-pre-wrap">
                        {activeQuestion.description}
                      </p>
                    </div>

                    {activeQuestion.requirements && (
                      <div className="pt-4 border-t border-slate-800">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                          Constraints & Reqs
                        </h4>
                        <ul className="grid gap-2">
                          {activeQuestion.requirements.map(
                            (req: string, i: number) => (
                              <li
                                key={i}
                                className="flex items-start gap-2.5 text-sm text-slate-300"
                              >
                                <div className="mt-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                                <span className="opacity-90">{req}</span>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat Interface */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 text-slate-400 ml-1 sticky top-0 bg-slate-950/80 backdrop-blur py-2 z-10">
                <Bot className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">
                  Interviewer Chat
                </span>
              </div>

              <div className="space-y-6 pl-1 pr-2 pb-20">
                {messages.slice(1).map((msg) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id}
                    className={cn(
                      "flex gap-4 text-sm max-w-[95%]",
                      msg.role === "user" ? "ml-auto flex-row-reverse" : "",
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border shadow-lg",
                        msg.role === "ai"
                          ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                          : "bg-slate-800 border-slate-700 text-slate-300",
                      )}
                    >
                      {msg.role === "ai" ? (
                        <Bot className="w-4 h-4" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "rounded-2xl px-5 py-3.5 leading-relaxed shadow-sm",
                        msg.role === "ai"
                          ? "bg-slate-900 text-slate-200 rounded-tl-none border border-slate-800"
                          : "bg-indigo-600 text-white rounded-tr-none shadow-indigo-900/20",
                      )}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                      {msg.type === "success" && (
                        <div className="mt-3 flex items-center gap-2 text-green-400 bg-green-400/10 px-3 py-2 rounded-lg border border-green-400/20">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="font-medium text-xs">
                            Test Cases Passed
                          </span>
                        </div>
                      )}
                      {msg.type === "error" && (
                        <div className="mt-3 flex items-center gap-2 text-red-400 bg-red-400/10 px-3 py-2 rounded-lg border border-red-400/20">
                          <XCircle className="w-4 h-4" />
                          <span className="font-medium text-xs">
                            Issues Detected
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {activeQuestion && (
                <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
                  <Button
                    variant="secondary"
                    onClick={handleAskHelp}
                    className="w-full bg-slate-800/80 backdrop-blur hover:bg-slate-700 text-slate-300 border border-slate-700 shadow-xl"
                  >
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Request Hint
                    <span className="ml-auto text-xs opacity-50 bg-slate-950 px-1.5 py-0.5 rounded">
                      10 XP Cost
                    </span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: Editor */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
          {/* Editor Tabs */}
          <div className="h-10 bg-[#1e1e1e] border-b border-[#2b2b2b] flex items-center justify-between px-4 select-none">
            <div className="flex items-center">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#1e1e1e] border-t-2 border-indigo-500 text-slate-300 text-xs font-medium">
                <Image
                  src={language.icon}
                  alt={language.id}
                  width={16}
                  height={16}
                  className="w-4 h-4 object-contain"
                />
                <span>
                  solution.
                  {language.id === "python"
                    ? "py"
                    : language.id === "javascript"
                      ? "js"
                      : language.id === "typescript"
                        ? "ts"
                        : language.id === "react"
                          ? "tsx"
                          : language.id === "cpp"
                            ? "cpp"
                            : "java"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <button
                onClick={() => setIsTerminalOpen(!isTerminalOpen)}
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1 rounded transition-colors",
                  isTerminalOpen
                    ? "bg-indigo-500/10 text-indigo-400"
                    : "hover:bg-slate-800 text-slate-500",
                )}
              >
                <TerminalIcon className="w-3.5 h-3.5" />
                <span>Terminal</span>
              </button>
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500/50"></div>{" "}
                Auto-saved
              </span>
            </div>
          </div>

          <div className="flex-1 flex flex-col relative overflow-hidden">
            <div className="flex-1 min-h-0">
              <Editor
                height="100%"
                language={language.id}
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 15,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 20, bottom: 20 },
                  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                  smoothScrolling: true,
                  cursorBlinking: "expand",
                  fontLigatures: true,
                }}
              />
            </div>

            {/* Terminal Area */}
            <AnimatePresence>
              {isTerminalOpen && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "30%" }}
                  exit={{ height: 0 }}
                  className="bg-[#1e1e1e] border-t border-[#2b2b2b] flex flex-col z-20"
                >
                  <div className="h-9 min-h-9 flex items-center justify-between px-4 bg-[#252526] border-b border-[#2b2b2b]">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <TerminalIcon className="w-3.5 h-3.5" />
                      Output Terminal
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setOutput("")}
                        className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors uppercase font-bold"
                      >
                        Clear
                      </button>
                      <button
                        onClick={() => setIsTerminalOpen(false)}
                        className="text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 p-4 font-mono text-sm overflow-auto text-slate-300 whitespace-pre-wrap selection:bg-indigo-500/30">
                    {output || (
                      <span className="text-slate-600 italic">
                        Run your code to see output...
                      </span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Run / Submit Floating Bar */}
            <div className="absolute bottom-8 right-8 flex items-center gap-3 z-30">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={handleRunCode}
                  disabled={isRunning || isChecking}
                  className="h-12 px-6 rounded-full bg-slate-800/90 backdrop-blur hover:bg-slate-700 text-white border border-slate-700 shadow-2xl transition-all"
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin text-indigo-400" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2 text-green-400 fill-green-400" />
                      Run Code
                    </>
                  )}
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={isChecking || !activeQuestion}
                  className={cn(
                    "h-12 px-8 rounded-full shadow-2xl transition-all duration-300 font-semibold tracking-wide",
                    isChecking || !activeQuestion
                      ? "bg-slate-700 cursor-not-allowed text-white"
                      : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-500/25 border border-indigo-400/20",
                  )}
                >
                  {isChecking ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Evaluating...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2 fill-current" />
                      Submit Solution
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
