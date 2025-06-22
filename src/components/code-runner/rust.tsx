"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Play, FileCode, ChevronDown, ChevronUp, Wifi, WifiOff } from 'lucide-react'

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
  const [isOutputOpen, setIsOutputOpen] = useState(true)
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

      if (data.type === "output/execute/wsExecuteStdout")
      {
        setOutput((prev) => [...prev, { text: data.payload, type: "stdout" }])
        setIsRunning(false)
      } else if (data.type === "output/execute/wsExecuteStderr")
      {
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
      if (ws.current)
      {
        ws.current.close()
      }
    }
  }, [websocketUrl])

  const runCode = () => {
    if (!isConnected || !ws.current)
    {
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

    try
    {
      ws.current.send(JSON.stringify(executeMessage))
    } catch (error)
    {
      setOutput((prev) => [...prev, { text: `Error sending code: ${error}`, type: "stderr" }])
      setHasErrors(true)
      setIsRunning(false)
    }
  }

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
            <span className="text-sm font-medium text-foreground">main.rs</span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Connection Status */}
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <Wifi className="h-4 w-4 text-emerald-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              <div className={`h-2 w-2 rounded-full transition-colors duration-300 ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                }`} />
            </div>

            <button
              onClick={runCode}
              disabled={!isConnected || isRunning}
              className={`px-4 py-2 rounded-md text-white text-sm flex items-center gap-2 font-medium transition-all duration-200 ${!isConnected
                ? "bg-gray-600 cursor-not-allowed opacity-70"
                : isRunning
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
        </div>

        {/* Code Editor */}
        <div className="border-x border-b border-border/50 rounded-b-lg overflow-hidden">
          <textarea
            value={code}
            placeholder="Enter Rust code here..."
            onChange={handleCodeChange}
            className="w-full font-mono text-sm bg-background text-foreground p-4 min-h-[300px] resize-none border-0 focus:outline-none focus:ring-0"
            style={{
              fontFamily: 'JetBrains Mono, Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
              fontSize: '14px',
              lineHeight: '1.6',
            }}
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
          <div className="p-4 min-h-[200px] max-h-[400px] overflow-y-auto bg-background">
            <pre className="whitespace-pre-wrap break-words m-0 font-mono text-sm leading-relaxed">
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

export default RustRunner