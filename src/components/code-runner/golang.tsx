"use client"

import type React from "react"
import { useState } from "react"
import { CodeEditor } from './code-editor'
import { RunnerShell, type RunnerOutput } from "./runner-shell"

interface GoPlaygroundResponse {
  events?: {
    Message: string
    Kind: "stdout" | "stderr"
    Delay: number
  }[]
}

interface GoRunnerProps {
  initialCode?: string
}

const GoRunner: React.FC<GoRunnerProps> = ({
  initialCode = 'package main\n\nimport (\n\t"fmt"\n)\n\nfunc main() {\n\tfmt.Println("Hello, World!")\n}\n',
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<RunnerOutput[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);
  const [isOutputOpen, setIsOutputOpen] = useState(true);

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
      const newOutput: RunnerOutput[] = [];

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


  return (
    <RunnerShell
      filename="main.go"
      runtime="Go"
      status={isRunning ? "running" : hasErrors ? "error" : "ready"}
      output={output}
      outputOpen={isOutputOpen}
      canRun={!isRunning}
      onRun={runCode}
      onOutputToggle={() => setIsOutputOpen((open) => !open)}
    >
      <CodeEditor value={code} onValueChange={setCode} language="go" placeholder="Enter Go code" />
    </RunnerShell>
  )
}

export default GoRunner
