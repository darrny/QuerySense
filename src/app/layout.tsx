import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'QuerySense - Data Analysis',
  description: 'Intelligent data analysis tool',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-blue-50">
        <nav className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold text-white">
              Query<span className="text-blue-200">Sense</span>
            </h1>
            <p className="text-blue-100 text-sm">Data Analysis Made Simple</p>
          </div>
        </nav>
        <main className="container mx-auto p-6">
          {children}
        </main>
      </body>
    </html>
  )
}