"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Play, FileCode, ChevronDown, ChevronUp } from 'lucide-react'

interface GoPlaygroundResponse {
  events?: {
    Message: string
    Kind: "stdout" | "stderr"
    Delay: number
  }[]
}

interface OutputItem {
  text: string
  type: "stdout" | "stderr"
}

interface GoRunnerProps {
  initialCode?: string
}

const GoRunner: React.FC<GoRunnerProps> = ({
  initialCode = 'package main\n\nimport (\n\t"fmt"\n)\n\nfunc main() {\n\tfmt.Println("Hello, World!")\n}\n',
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<OutputItem[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);
  const [isOutputOpen, setIsOutputOpen] = useState(true);
  const outputEndRef = useRef<HTMLDivElement>(null);

  const runCode = async () => {
    setIsRunning(true);
    setHasErrors(false);
    setOutput([]);

    const requestBody = {
      files: {
        "main.go": code
      }
    };

    try
    {
      const workerEndpoint = 'https://remote-golang.appiahboaduprince.workers.dev';
      const response = await fetch(workerEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok)
      {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GoPlaygroundResponse = await response.json();
      const newOutput: OutputItem[] = [];

      data.events?.forEach(event => {
        if (event.Message)
        {
          newOutput.push({
            text: event.Message,
            type: event.Kind
          });
        }
      });

      if (newOutput.length === 0)
      {
        newOutput.push({
          text: "Program executed successfully (no output)",
          type: "stdout"
        });
      }

      setOutput(newOutput);
      setHasErrors(newOutput.some(item => item.type === "stderr"));

    } catch (error)
    {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setOutput([{
        text: `Error: ${errorMessage}`,
        type: "stderr"
      }]);
      setHasErrors(true);
    } finally
    {
      setIsRunning(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value)
  }

  return (
    <div className="space-y-4">
      {/* Code Editor Section */}
      <div className="group relative">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-muted/80 border border-border/50 rounded-t-lg">
          <div className="flex items-center space-x-2">
            <FileCode className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">main.go</span>
          </div>

          <button
            onClick={runCode}
            disabled={isRunning}
            className={`px-4 py-2 rounded-md text-white text-sm flex items-center gap-2 font-medium transition-all duration-200 ${isRunning
              ? "bg-amber-500 shadow-md cursor-not-allowed"
              : hasErrors
                ? "bg-amber-500 hover:bg-amber-600 shadow-md hover:shadow-lg"
                : "bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg"
              }`}
          >
            <Play className="h-4 w-4" />
            {isRunning ? "Running..." : "Run Code"}
          </button>
        </div>

        {/* Code Editor */}
        <div className="border-x border-b border-border/50 rounded-b-lg overflow-hidden">
          <textarea
            value={code}
            onChange={handleCodeChange}
            className="w-full font-mono text-sm bg-background text-foreground p-4 min-h-[300px] resize-none border-0 focus:outline-none focus:ring-0"
            style={{
              fontFamily: 'JetBrains Mono, Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
              fontSize: '14px',
              lineHeight: '1.6',
            }}
            placeholder="Enter Go code here..."
          />
        </div>

        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 pointer-events-none rounded-lg bg-gradient-to-br from-transparent via-transparent to-muted/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Output Section */}
      <div className="border border-border/50 rounded-lg overflow-hidden bg-muted/30">
        <button
          onClick={() => setIsOutputOpen(!isOutputOpen)}
          className="w-full px-4 py-3 border-b border-border/50 bg-muted/50 hover:bg-muted/70 transition-colors duration-200 flex items-center justify-between"
        >
          <div className="flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full ${hasErrors ? 'bg-red-500' : 'bg-emerald-500'}`} />
            <span className="text-sm font-medium text-foreground">Output</span>
            {output.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {output.length} line{output.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          {isOutputOpen ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {isOutputOpen && (
          <div className="p-4 min-h-[200px] max-h-[400px] overflow-y-auto">
            <pre className="break-words m-0 font-mono text-sm leading-relaxed">
              {output.length === 0 ? (
                <span className="text-muted-foreground italic">No output yet. Run the code to see results.</span>
              ) : (
                output.map((item, index) => (
                  <div
                    key={index}
                    className={`${item.type === "stdout"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                      } ${index === output.length - 1 ? "" : "mb-2"}`}
                  >
                    {item.text}
                  </div>
                ))
              )}
              <div ref={outputEndRef} />
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default GoRunner