'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useState } from 'react'

function CodeBlock({ children, className }: { children: string; className?: string }) {
  const [copied, setCopied] = useState(false)
  const isBlock = Boolean(className?.startsWith('language-'))

  if (!isBlock) {
    return (
      <code className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded text-sm font-mono border border-indigo-100">
        {children}
      </code>
    )
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative my-4 group">
      <button
        onClick={handleCopy}
        className="absolute top-2.5 right-3 text-xs text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors opacity-0 group-hover:opacity-100"
      >
        {copied ? '✓ 복사됨' : '복사'}
      </button>
      <pre className="bg-gray-50 border border-gray-200 text-gray-800 p-4 rounded-lg overflow-x-auto text-sm leading-relaxed">
        <code className={className}>{children}</code>
      </pre>
    </div>
  )
}

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-gray max-w-none prose-headings:font-semibold prose-a:text-indigo-600 prose-code:before:content-none prose-code:after:content-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Strip the prose-generated <pre> wrapper so our CodeBlock controls all styling
          pre({ children }) {
            return <>{children}</>
          },
          code({ className, children }) {
            return (
              <CodeBlock className={className}>{String(children).replace(/\n$/, '')}</CodeBlock>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
