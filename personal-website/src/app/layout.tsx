import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import TopNav from '@/components/TopNav'
import NavHeader from '@/components/NavHeader'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mason Veilleux',
  description: 'Full-Stack Economics',
  icons: {
    icon: '/anon-pic-transp.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gradient-to-br from-white to-stone-50`}>
        <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm z-50">
          <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
            <NavHeader />
            <TopNav />
          </div>
        </nav>
        <main className="max-w-5xl mx-auto px-6 pt-24 pb-12">
          {children}
        </main>
      </body>
    </html>
  )
}