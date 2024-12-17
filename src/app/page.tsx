'use client'

import { useState } from 'react'
import FileUpload from '@/components/FileUpload'
import QueryInput from '@/components/QueryInput'
import AnalysisResult from '@/components/AnalysisResult'

export default function Home() {
  const [data, setData] = useState<any[]>([])
  const [analysisResult, setAnalysisResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">
            Query<span className="text-blue-200">Sense</span>
          </h1>
          <p className="text-lg text-blue-100">
            Upload your CSV file and ask questions about your data
          </p>
        </div>

        {/* File Upload */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <FileUpload onDataLoaded={setData} />
        </div>

        {/* Query Input */}
        {data.length > 0 && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <QueryInput
              data={data}
              onAnalysisComplete={setAnalysisResult}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </div>
        )}

        {/* Analysis Result */}
        {analysisResult && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <AnalysisResult result={analysisResult} data={data} />
          </div>
        )}
      </div>
    </div>
  )
}