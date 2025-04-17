"use client"

import type React from "react"
import { useState, useRef } from "react"

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

    try {
      const workerEndpoint = 'https://remote-golang.appiahboaduprince.workers.dev';
      const response = await fetch(workerEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GoPlaygroundResponse = await response.json();
      const newOutput: OutputItem[] = [];

      data.events?.forEach(event => {
        if (event.Message) {
          newOutput.push({
            text: event.Message,
            type: event.Kind
          });
        }
      });

      if (newOutput.length === 0) {
        newOutput.push({
          text: "Program executed successfully (no output)",
          type: "stdout"
        });
      }

      setOutput(newOutput);
      setHasErrors(newOutput.some(item => item.type === "stderr"));

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setOutput([{
        text: `Error: ${errorMessage}`,
        type: "stderr"
      }]);
      setHasErrors(true);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value)
  }

  return (
    <div className="rounded-lg">
      <div className="mb-6 border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b flex justify-between items-center">
          <button
            onClick={runCode}
            disabled={isRunning}
            className={`px-5 py-2 rounded-md text-white text-sm flex items-center gap-2 text-sm ${isRunning
              ? "bg-amber-500 shadow-md"
              : hasErrors
                ? "bg-amber-500 hover:bg-amber-600 shadow-md hover:shadow-lg"
                : "bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg"
              } transition-all duration-200`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            {isRunning ? "Running..." : "Run Code"}
          </button>

          <div>main.go</div>
        </div>
        <textarea
          value={code}
          onChange={handleCodeChange}
          className="w-full h-96 p-6 font-mono text-sm resize-y leading-relaxed"
          spellCheck="false"
        />
      </div>

      <details className="rounded-lg border overflow-hidden mb-4 group" open>
        <summary className="px-4 py-3 border-b cursor-pointer flex items-center">
          <span className="text-sm font-medium">Output</span>
          <div className="ml-auto text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-open:rotate-180 transition-transform">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </summary>
        <div className="p-6 min-h-48 max-h-80 overflow-y-auto">
          <pre className="whitespace-pre-wrap break-words m-0 font-mono text-sm leading-relaxed">
            {output.length === 0 ? (
              <span className="text-sm">No output yet. Run the code to see results.</span>
            ) : null}
            {output.map((item, index) => (
              <div
                key={index}
                className={`${item.type === "stdout" ? "text-emerald-400" : "text-red-400"} ${index === output.length - 1 ? "" : "mb-3"}`}
              >
                {item.text}
              </div>
            ))}
            <div ref={outputEndRef} />
          </pre>
        </div>
      </details>
    </div>
  )
}

export default GoRunner