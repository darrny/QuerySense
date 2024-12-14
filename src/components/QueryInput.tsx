'use client'

import { useState } from 'react'

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

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Ask a Question</h2>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="What would you like to know about your data?"
        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
      />
      <button
        onClick={handleAnalysis}
        disabled={isLoading || !query.trim()}
        className={`w-full py-2 px-4 rounded-lg font-medium text-white
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