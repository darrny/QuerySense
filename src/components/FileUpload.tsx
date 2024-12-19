'use client'

import { useState } from 'react'
import Papa from 'papaparse'

interface FileUploadProps {
  onDataLoaded: (data: any[]) => void
}

interface FileInfo {
  fileName: string;
  numberOfRows: number;
  columnNames: string[];
  fileSize: string;
}

export default function FileUpload({ onDataLoaded }: FileUploadProps) {
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          onDataLoaded(results.data);
          if (results.data && results.data.length > 0 && typeof results.data[0] === 'object') {
            setFileInfo({
              fileName: file.name,
              numberOfRows: results.data.length,
              columnNames: Object.keys(results.data[0] as object),
              fileSize: `${(file.size / 1024).toFixed(2)} KB`
            });
          }
        },
      })
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-blue-900">Upload Data</h2>
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-blue-200 border-dashed rounded-lg cursor-pointer bg-white hover:bg-blue-50 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-4 text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
            </svg>
            <p className="mb-2 text-sm text-blue-700">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-blue-600">CSV files only</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept=".csv"
            onChange={handleFileUpload}
          />
        </label>
      </div>

      {fileInfo && (
        <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200 shadow-sm">
          <h4 className="font-semibold text-blue-900 mb-3">File Information:</h4>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-center">
              <span className="font-medium w-32">File Name:</span>
              <span>{fileInfo.fileName}</span>
            </li>
            <li className="flex items-center">
              <span className="font-medium w-32">Number of Rows:</span>
              <span>{fileInfo.numberOfRows}</span>
            </li>
            <li className="flex items-center">
              <span className="font-medium w-32">File Size:</span>
              <span>{fileInfo.fileSize}</span>
            </li>
            <li className="flex flex-col">
              <span className="font-medium mb-1">Columns:</span>
              <div className="flex flex-wrap gap-2">
                {fileInfo.columnNames.map((column: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs"
                  >
                    {column}
                  </span>
                ))}
              </div>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}