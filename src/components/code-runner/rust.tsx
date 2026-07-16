"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { CodeEditor } from './code-editor'
import { RunnerShell, type RunnerOutput } from "./runner-shell"

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
  const [output, setOutput] = useState<RunnerOutput[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [hasErrors, setHasErrors] = useState(false)
  const [isOutputOpen, setIsOutputOpen] = useState(true)
  const ws = useRef<WebSocket | null>(null)
  const sequenceNumber = useRef(0)
  useEffect(() => {
    ws.current = new WebSocket(websocketUrl)

    ws.current.onopen = () => {
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
      setIsConnected(false)
    }

    ws.current.onerror = () => {
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

  return (
    <RunnerShell
      filename="main.rs"
      runtime="Rust"
      status={!isConnected ? (hasErrors ? "error" : "connecting") : isRunning ? "running" : hasErrors ? "error" : "ready"}
      output={output}
      outputOpen={isOutputOpen}
      canRun={isConnected && !isRunning}
      onRun={runCode}
      onOutputToggle={() => setIsOutputOpen((open) => !open)}
    >
      <CodeEditor value={code} onValueChange={setCode} language="rust" placeholder="Enter Rust code" />
    </RunnerShell>
  )
}

export default RustRunner
