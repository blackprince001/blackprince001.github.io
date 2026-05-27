"use client"

import Editor from "react-simple-code-editor"
import Prism from "prismjs"
// prism-clike is a shared base several grammars extend; load it first.
import "prismjs/components/prism-clike"
import "prismjs/components/prism-python"
import "prismjs/components/prism-rust"
import "prismjs/components/prism-go"

export type CodeLang = "python" | "rust" | "go"

interface CodeEditorProps {
  value: string
  onValueChange: (code: string) => void
  language: CodeLang
  placeholder?: string
}

// Lightweight code-aware editor: a transparent textarea overlaid on a
// Prism-highlighted <pre>. Handles Tab to indent. Token colors live in
// globals.css under `.code-editor`.
export function CodeEditor({
  value,
  onValueChange,
  language,
  placeholder,
}: CodeEditorProps) {
  return (
    <Editor
      value={value}
      onValueChange={onValueChange}
      highlight={(code) =>
        Prism.highlight(
          code,
          Prism.languages[language] ?? Prism.languages.clike,
          language
        )
      }
      padding={16}
      placeholder={placeholder}
      className="code-editor min-h-[300px] bg-background text-foreground"
      textareaClassName="focus:outline-none focus:ring-0"
      style={{
        fontFamily:
          'JetBrains Mono, Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
        fontSize: "14px",
        lineHeight: "1.6",
      }}
    />
  )
}

export default CodeEditor
