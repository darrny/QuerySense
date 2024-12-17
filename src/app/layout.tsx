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
      <body className={`${inter.className} min-h-screen bg-blue-900`}>
        <main className="container mx-auto p-6">
          {children}
        </main>
      </body>
    </html>
  )
}