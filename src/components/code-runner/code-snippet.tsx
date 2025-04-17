"use client"

import CodeEditor from '@uiw/react-textarea-code-editor'

interface CodeSnippetProps {
  code: string
  language: string
}

const CodeSnippet = async ({ code, language }: CodeSnippetProps) => {
  return (
    <div className="rounded-lg">
      <div className="mb-6 border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b flex justify-between items-center">
          <div>{language}</div>
        </div>
        <CodeEditor
          value={code}
          language={language}
          className="w-full font-mono text-sm dark:bg-transparent dark:text-slate-100 m-4"
          style={{
            fontFamily: 'monospace',
          }}
          data-color-mode="light"
        />
      </div>
    </div>
  )
}

export default CodeSnippet
