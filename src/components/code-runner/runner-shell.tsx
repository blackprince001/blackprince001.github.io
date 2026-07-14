"use client"

import { ChevronDown, Play } from "lucide-react"
import { type ReactNode, useId } from "react"

export interface RunnerOutput {
  text: string
  type: "stdout" | "stderr"
}

interface RunnerShellProps {
  filename: string
  runtime: string
  status: "connecting" | "ready" | "running" | "error"
  output: RunnerOutput[]
  outputOpen: boolean
  canRun: boolean
  onRun: () => void
  onOutputToggle: () => void
  children: ReactNode
}

export function RunnerShell({ filename, runtime, status, output, outputOpen, canRun, onRun, onOutputToggle, children }: RunnerShellProps) {
  const outputId = useId()
  const statusLabel = status === "connecting" ? "Connecting" : status === "running" ? "Running" : status === "error" ? "Needs attention" : "Ready"

  return (
    <section className="code-runner" aria-label={`${runtime} code runner`}>
      <header className="code-runner__header">
        <div className="code-runner__identity">
          <span>{filename}</span>
          <span>{runtime}</span>
        </div>
        <div className="code-runner__actions">
          <span className="code-runner__status" data-status={status} role="status">{statusLabel}</span>
          <button type="button" className="component-button code-runner__run" disabled={!canRun} onClick={onRun}>
            <Play aria-hidden="true" /> {status === "running" ? "Running" : "Run"}
          </button>
        </div>
      </header>
      <div className="code-runner__editor">{children}</div>
      <div className="code-runner__output">
        <button type="button" className="code-runner__output-trigger" aria-expanded={outputOpen} aria-controls={outputId} onClick={onOutputToggle}>
          <span>Console</span>
          <span>{output.length ? `${output.length} ${output.length === 1 ? "entry" : "entries"}` : "No output"}</span>
          <ChevronDown aria-hidden="true" />
        </button>
        <div id={outputId} className="code-runner__output-body" hidden={!outputOpen} aria-live="polite" aria-atomic="true">
          {output.length === 0 ? (
            <p>Run the program to see its output.</p>
          ) : (
            <pre>{output.map((item, index) => <span key={index} data-stream={item.type}>{item.text}{item.text.endsWith("\n") ? "" : "\n"}</span>)}</pre>
          )}
        </div>
      </div>
    </section>
  )
}
