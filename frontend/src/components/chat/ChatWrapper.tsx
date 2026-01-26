'use client'

import React, { useState } from 'react'
import { ChatInterface } from './ChatInterface'
import { MessageCircle } from 'lucide-react'

export const ChatWrapper = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all z-50 flex items-center justify-center"
        aria-label="Toggle chat"
      >
        <MessageCircle size={24} />
      </button>

      {isOpen && (
        <ChatInterface onClose={() => setIsOpen(false)} />
      )}
    </>
  )
}
