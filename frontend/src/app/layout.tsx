import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { ChatWrapper } from '@/components/chat/ChatWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Todo App - Organize Your Life',
  description: 'A modern todo application to help you organize your tasks and boost productivity.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <ChatWrapper />
        </Providers>
      </body>
    </html>
  )
}
