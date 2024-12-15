'use client'

import { useState, KeyboardEvent } from 'react'

interface QueryInputProps {
  data: any[]
  onAnalysisComplete: (result: string) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export default function QueryInput({
  data,
  onAnalysisComplete,
  isLoading,
  setIsLoading,
}: QueryInputProps) {
  const [query, setQuery] = useState('')

  const handleAnalysis = async () => {
    if (!query.trim()) return
    setIsLoading(true)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, query }),
      })
      const result = await response.json()
      onAnalysisComplete(result.result)
    } catch (error) {
      console.error('Error:', error)
    }
    setIsLoading(false)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Allow shift+enter for new line
        return
      }
      // Prevent default enter behavior
      e.preventDefault()
      // Submit if not loading
      if (!isLoading) {
        handleAnalysis()
      }
    }
  }

  return (
    <div className="mb-8">
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask a question about your data..."
        className="w-full p-4 border rounded-lg mb-4 h-32"
      />
      <button
        onClick={handleAnalysis}
        disabled={isLoading || !query.trim()}
        className={`
          w-full py-2 px-4 rounded-lg font-medium text-white
          ${isLoading || !query.trim() 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'
          }
        `}
      >
        {isLoading ? 'Analyzing...' : 'Analyze'}
      </button>
    </div>
  )
}