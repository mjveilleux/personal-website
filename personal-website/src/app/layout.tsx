import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mason Veilleux',
  description: 'Full-stack Economist',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm border-b border-stone-100 z-50">
          <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-medium hover:text-stone-600 transition-colors">
              Full Stack Economist
            </Link>
            <div className="space-x-8">
              {['About', 'Research', 'Blog'].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="hover:text-stone-600 transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </nav>
        <main className="max-w-5xl mx-auto px-6 pt-24 pb-12"
            key={Math.random()} >
          {children}
        </main>
      </body>
    </html>
  )
}