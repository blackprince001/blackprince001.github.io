"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"

interface WebSocketMessage {
  type: string
  payload: any
  meta: {
    websocket: boolean
    sequenceNumber: number
  }
}

interface RustRunnerProps {
  initialCode?: string
  websocketUrl?: string
}

const RustRunner: React.FC<RustRunnerProps> = ({
  initialCode = 'fn main() {\n    println!("Hello, World");\n}',
  websocketUrl = "wss://play.rust-lang.org/websocket",
}) => {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState<{ text: string; type: "stdout" | "stderr" }[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [hasErrors, setHasErrors] = useState(false)
  const ws = useRef<WebSocket | null>(null)
  const sequenceNumber = useRef(0)
  const outputEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [output])

  useEffect(() => {
    ws.current = new WebSocket(websocketUrl)

    ws.current.onopen = () => {
      console.log("WebSocket connected")
      setIsConnected(true)
      setHasErrors(false)

      const connectMessage: WebSocketMessage = {
        type: "websocket/connected",
        payload: { iAcceptThisIsAnUnsupportedApi: true },
        meta: { websocket: true, sequenceNumber: sequenceNumber.current++ },
      }
      ws.current?.send(JSON.stringify(connectMessage))
    }

    ws.current.onmessage = (event) => {
      const data: WebSocketMessage = JSON.parse(event.data)

      if (data.type === "output/execute/wsExecuteStdout") {
        setOutput((prev) => [...prev, { text: data.payload, type: "stdout" }])
        setIsRunning(false)
      } else if (data.type === "output/execute/wsExecuteStderr") {
        setOutput((prev) => [...prev, { text: data.payload, type: "stderr" }])
        setHasErrors(true)
        setIsRunning(false)
      }
    }

    ws.current.onclose = () => {
      console.log("WebSocket disconnected")
      setIsConnected(false)
    }

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error)
      setOutput((prev) => [...prev, { text: "WebSocket connection error", type: "stderr" }])
      setHasErrors(true)
      setIsConnected(false)
      setIsRunning(false)
    }

    return () => {
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [websocketUrl])

  const runCode = () => {
    if (!isConnected || !ws.current) {
      setOutput((prev) => [...prev, { text: "Error: Not connected to WebSocket", type: "stderr" }])
      setHasErrors(true)
      return
    }

    setIsRunning(true)
    setHasErrors(false)
    setOutput([])

    const executeMessage: WebSocketMessage = {
      type: "output/execute/wsExecuteRequest",
      payload: {
        channel: "stable",
        mode: "debug", // can be changed to release for release versions of binaries
        edition: "2024",
        crateType: "bin",
        tests: false,
        code: code,
        backtrace: false,
      },
      meta: {
        websocket: true,
        sequenceNumber: sequenceNumber.current++,
      },
    }

    try {
      ws.current.send(JSON.stringify(executeMessage))
    } catch (error) {
      setOutput((prev) => [...prev, { text: `Error sending code: ${error}`, type: "stderr" }])
      setHasErrors(true)
      setIsRunning(false)
    }
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value)
  }

  return (
    <div className="rounded-lg">
      <div className="mb-6 border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b flex justify-between items-center">
          <button
            onClick={runCode}
            disabled={!isConnected || isRunning}
            className={`px-5 py-2 rounded-md text-white text-sm flex items-center gap-2 text-sm ${!isConnected
              ? "bg-gray-600 cursor-not-allowed opacity-70"
              : isRunning
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

          <div>
            <div className={`ml-3 h-3 w-3 rounded-full transition-colors duration-1500 ${isConnected
              ? "bg-emerald-500 shadow-emerald-300 animate-pulse"
              : "bg-red-500"
              }`} />
          </div>

          <div>main.rs</div>

        </div>
        <textarea
          value={code}
          onChange={handleCodeChange}
          className="w-full h-96 p-6 font-mono text-sm resize-y leading-relaxed"
          spellCheck="false"
        />
      </div>

      <details className="rounded-lg border overflow-hidden mb-4 group">
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

export default RustRunner