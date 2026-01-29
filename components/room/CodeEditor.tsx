"use client";

import React, { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Play, Loader2, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  roomId: string;
  onCodeChange?: (code: string) => void;
}

export function CodeEditor({
  initialCode = "// Start coding...",
  language = "javascript",
  roomId,
  onCodeChange,
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const editorRef = useRef<any>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const isUpdatingFromRemote = useRef(false);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput("Running...");

    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: selectedLanguage,
          version: "*",
          files: [{ content: code }],
        }),
      });

      const data = await response.json();

      if (data.run) {
        setOutput(data.run.output || "No output");
      } else {
        setOutput("Error running code: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      setOutput("Failed to execute code: " + String(error));
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    const channel = supabase.channel(`code:${roomId}`);

    channel
      .on("broadcast", { event: "code-update" }, (payload) => {
        isUpdatingFromRemote.current = true;
        setCode(payload.payload.code);
        setTimeout(() => {
          isUpdatingFromRemote.current = false;
        }, 100);
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  // Broadcast code change
  useEffect(() => {
    if (isUpdatingFromRemote.current) return;

    const timeout = setTimeout(() => {
      if (channelRef.current) {
        channelRef.current.send({
          type: "broadcast",
          event: "code-update",
          payload: { code },
        });
      }
      if (onCodeChange) {
        onCodeChange(code);
      }
    }, 1000); // Debounce 1s

    return () => clearTimeout(timeout);
  }, [code, onCodeChange]);

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-white overflow-hidden rounded-lg shadow-xl border border-gray-800">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium text-gray-400">Language:</span>
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-[120px] h-8 bg-[#333333] border-none text-white text-xs">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent className="bg-[#252526] text-white border-gray-700">
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleRunCode}
          disabled={isRunning}
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white border-none h-8 px-3"
        >
          {isRunning ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Play className="w-4 h-4 mr-2" />
          )}
          Run Code
        </Button>
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          language={selectedLanguage}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || "")}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            padding: { top: 16 },
            scrollBeyondLastLine: false,
          }}
        />
      </div>

      {/* Terminal / Output Area */}
      <div className="h-[30%] min-h-[150px] bg-[#1e1e1e] border-t border-gray-700 flex flex-col">
        <div className="px-4 py-1 bg-[#252526] text-gray-400 text-xs flex items-center border-b border-gray-700">
          <Terminal className="w-3 h-3 mr-2" />
          Console Output
        </div>
        <div className="flex-1 p-4 font-mono text-sm overflow-auto text-gray-300 whitespace-pre-wrap">
          {output || (
            <span className="text-gray-600 italic">
              Run your code to see output...
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
