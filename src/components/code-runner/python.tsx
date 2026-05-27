"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Play, FileCode, ChevronDown, ChevronUp } from "lucide-react"
import { CodeEditor } from "./code-editor"

// edge-python custom element runtime. Loaded once, lazily, from the CDN.
// Auto-defines the <edge-python> element on import.
const RUNTIME_URL = "https://runtime.edgepython.com/js/src/element.js"

// The element instance exposes an imperative API once its worker is ready.
// `run`/`onOutput` are prototype methods that delegate to `worker`, so the
// presence of `worker` — not of the methods — is what signals readiness.
type EdgePythonElement = HTMLElement & {
  worker?: unknown
  run: (src: string, opts?: unknown) => Promise<{ out?: string; ms?: number }>
  onOutput: (handler: (line: string) => void) => void
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "edge-python": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & { entry?: string; packages?: string }
    }
  }
}

let runtimePromise: Promise<void> | null = null
function loadRuntime(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve()
  if (runtimePromise) return runtimePromise
  runtimePromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      "script[data-edge-python]"
    )
    const done = () =>
      customElements.whenDefined("edge-python").then(() => resolve())
    if (existing) {
      done()
      return
    }
    const script = document.createElement("script")
    script.type = "module"
    script.src = RUNTIME_URL
    script.dataset.edgePython = "true"
    script.onload = done
    script.onerror = () => reject(new Error("Failed to load edge-python runtime"))
    document.head.appendChild(script)
  })
  return runtimePromise
}

interface PythonRunnerProps {
  initialCode?: string
}

const PythonRunner: React.FC<PythonRunnerProps> = ({
  initialCode = 'print("Hello, World")',
}) => {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState<{ text: string; type: "stdout" | "stderr" }[]>([])
  const [isReady, setIsReady] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [hasErrors, setHasErrors] = useState(false)
  const [isOutputOpen, setIsOutputOpen] = useState(true)
  const elRef = useRef<EdgePythonElement | null>(null)
  const outputEndRef = useRef<HTMLDivElement>(null)
  // Lines streamed during the current run, so we know whether to fall back
  // to the resolved result.out (avoids double-printing).
  const streamedRef = useRef(0)

  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [output])

  useEffect(() => {
    let cancelled = false
    const el = elRef.current

    const onReady = () => {
      if (cancelled || !el) return
      setIsReady(true)
      // Stream stdout one line at a time while a run is in flight.
      el.onOutput((line) => {
        streamedRef.current += 1
        setOutput((prev) => [...prev, { text: line, type: "stdout" }])
      })
    }

    loadRuntime()
      .then(() => {
        if (cancelled || !el) return
        // The worker is created asynchronously in connectedCallback; its
        // presence (not the prototype methods) is what marks readiness.
        if (el.worker) onReady()
        else {
          el.addEventListener("ready", onReady, { once: true })
          // Guard the race where "ready" fired before the listener attached.
          if (el.worker) {
            el.removeEventListener("ready", onReady)
            onReady()
          }
        }
      })
      .catch(() => {
        if (cancelled) return
        setOutput((prev) => [
          ...prev,
          { text: "Failed to load the Python runtime.", type: "stderr" },
        ])
        setHasErrors(true)
      })

    return () => {
      cancelled = true
      el?.removeEventListener("ready", onReady)
    }
  }, [])

  const runCode = async () => {
    const el = elRef.current
    if (!isReady || !el) return

    setIsRunning(true)
    setHasErrors(false)
    setOutput([])
    streamedRef.current = 0

    try {
      const result = await el.run(code)
      // If nothing streamed via onOutput, fall back to the resolved stdout.
      if (streamedRef.current === 0 && result?.out) {
        setOutput([{ text: result.out, type: "stdout" }])
      }
    } catch (error) {
      setOutput((prev) => [
        ...prev,
        { text: `${error instanceof Error ? error.message : error}`, type: "stderr" },
      ])
      setHasErrors(true)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* The custom element drives a Web Worker; it renders nothing visible. */}
      <edge-python
        ref={elRef as React.Ref<HTMLElement>}
        style={{ display: "none" }}
      />

      {/* Code Editor Section */}
      <div className="group relative">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-muted/80 border border-border/50 rounded-t-lg">
          <div className="flex items-center space-x-2">
            <FileCode className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">main.py</span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Runtime Status */}
            <div className="flex items-center space-x-2">
              <div className={`h-2 w-2 rounded-full ${isReady ? "bg-emerald-500" : "bg-amber-500"}`} />
              <span className="text-sm text-muted-foreground">
                {isReady ? "Connected" : "Connecting…"}
              </span>
            </div>

            <button
              onClick={runCode}
              disabled={!isReady || isRunning}
              className={`px-4 py-2 rounded-md text-white text-sm flex items-center gap-2 font-medium transition-all duration-200 ${
                !isReady
                  ? "bg-gray-600 cursor-not-allowed opacity-70"
                  : isRunning
                    ? "bg-amber-500 shadow-md cursor-not-allowed"
                    : hasErrors
                      ? "bg-amber-500 hover:bg-amber-600 shadow-md hover:shadow-lg"
                      : "bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg"
              }`}
            >
              <Play className="h-4 w-4" />
              {isRunning ? "Running..." : isReady ? "Run Code" : "Loading..."}
            </button>
          </div>
        </div>

        {/* Code Editor */}
        <div className="border-x border-b border-border/50 rounded-b-lg overflow-hidden">
          <CodeEditor
            value={code}
            onValueChange={setCode}
            language="python"
            placeholder="Enter Python code here..."
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
            <div className={`h-2 w-2 rounded-full ${hasErrors ? "bg-red-500" : "bg-emerald-500"}`} />
            <span className="text-sm font-medium text-foreground">Output</span>
            {output.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {output.length} line{output.length !== 1 ? "s" : ""}
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
          <div className="p-4 min-h-[200px] max-h-[400px] overflow-y-auto bg-background">
            <pre className="whitespace-pre-wrap break-words m-0 font-mono text-sm leading-relaxed">
              {output.length === 0 ? (
                <span className="text-muted-foreground italic">
                  No output yet. Run the code to see results.
                </span>
              ) : (
                output.map((item, index) => (
                  <div
                    key={index}
                    className={`${
                      item.type === "stdout"
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

export default PythonRunner
