"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { CodeEditor } from "./code-editor"
import { RunnerShell, type RunnerOutput } from "./runner-shell"

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
  const [output, setOutput] = useState<RunnerOutput[]>([])
  const [isReady, setIsReady] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [hasErrors, setHasErrors] = useState(false)
  const [isOutputOpen, setIsOutputOpen] = useState(true)
  const elRef = useRef<EdgePythonElement | null>(null)
  // Lines streamed during the current run, so we know whether to fall back
  // to the resolved result.out (avoids double-printing).
  const streamedRef = useRef(0)

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
    <>
      <edge-python ref={elRef as React.Ref<HTMLElement>} style={{ display: "none" }} />
      <RunnerShell
        filename="main.py"
        runtime="Python"
        status={!isReady ? (hasErrors ? "error" : "connecting") : isRunning ? "running" : hasErrors ? "error" : "ready"}
        output={output}
        outputOpen={isOutputOpen}
        canRun={isReady && !isRunning}
        onRun={runCode}
        onOutputToggle={() => setIsOutputOpen((open) => !open)}
      >
        <CodeEditor value={code} onValueChange={setCode} language="python" placeholder="Enter Python code" />
      </RunnerShell>
    </>
  )
}

export default PythonRunner
