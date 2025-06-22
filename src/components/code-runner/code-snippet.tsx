"use client"

import { FileText } from 'lucide-react'

interface CodeSnippetProps {
  code: string
  language: string
}

const CodeSnippet = ({ code, language }: CodeSnippetProps) => {
  return (
    <div className="group relative">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-muted/80 border border-border/50 rounded-lg">
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{language}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
        </div>
      </div>

      <pre className="w-full font-mono text-sm text-foreground overflow-x-auto">
        <code className="block whitespace-pre" style={{
          fontFamily: 'JetBrains Mono, Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
          fontSize: '14px',
          lineHeight: '1.6',
        }}>
          {code}
        </code>
      </pre>
    </div>
  )
}

export default CodeSnippet
