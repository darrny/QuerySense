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
    const [error, setError] = useState<string | null>(null)

    const handleAnalysis = async () => {
        if (!query.trim()) return
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data, query }),
            })

            const result = await response.json()

            if (!response.ok || result.error) {
                throw new Error(result.error || 'Failed to analyze data');
            }

            if (!result.result || result.result.trim().length < 10) {
                throw new Error('Invalid response received');
            }

            onAnalysisComplete(result.result)
            setError(null)
        } catch (error) {
            console.error('Error:', error)
            setError(
                'I apologize, but I encountered an error analyzing your data. ' +
                'Please try rephrasing your question or try again in a moment.'
            )
            onAnalysisComplete('') // Clear previous results
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                return
            }
            e.preventDefault()
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
                className="w-full p-4 border border-blue-200 rounded-lg mb-4 h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            {error && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
                    <p className="mb-2 font-semibold">Error Message:</p>
                    <p>{error}</p>
                    <p className="mt-2 text-sm">
                        Suggestions:
                        <ul className="list-disc ml-5 mt-1">
                            <li>Try rephrasing your question</li>
                            <li>Make sure your question is clear and specific</li>
                            <li>Check if the data you uploaded is properly formatted</li>
                        </ul>
                    </p>
                </div>
            )}

            <button
                onClick={handleAnalysis}
                disabled={isLoading || !query.trim()}
                className={`
              w-full py-2 px-4 rounded-lg font-medium text-white transition-colors
              ${isLoading || !query.trim()
                        ? 'bg-blue-300 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }
            `}
            >
                {isLoading ? 'Analyzing...' : 'Analyze'}
            </button>
        </div>
    )
}