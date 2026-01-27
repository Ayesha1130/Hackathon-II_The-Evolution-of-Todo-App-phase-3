'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
//import { Message, ChatInput, useChatKit } from '@openai/chatkit-react'
//import { api } from '@/lib/api/client'
import { taskKeys } from '@/hooks/useTasks'
import { categoryKeys } from '@/hooks/useCategories'
import { Button } from '@/components/ui/Button'
import { X, Send } from 'lucide-react'

export const ChatInterface = ({ onClose }: { onClose: () => void }) => {
  const queryClient = useQueryClient()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // OpenAI ChatKit connection (Mocking or wrapping our custom API)
  // Since we have a backend that handles the Agent SDK, we'll use a standard flow
  // and trigger React Query refreshes when the Agent performing actions.

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    setIsLoading(true)
    const userMessage = { role: 'user', content }
    setMessages((prev) => [...prev, userMessage])

    // Placeholder for assistant message that will be updated
    const assistantMessageId = Date.now().toString()
    setMessages((prev) => [...prev, { role: 'assistant', content: '', id: assistantMessageId }])

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          content,
          conversation_id: conversationId,
        }),
      })

      if (!response.ok) throw new Error('Failed to connect to chat')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let accumulatedReply = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))

                if (data.conversation_id) {
                  setConversationId(data.conversation_id)
                }

                if (data.chunk) {
                  accumulatedReply += data.chunk
                  setMessages((prev) => prev.map(msg =>
                    msg.id === assistantMessageId ? { ...msg, content: accumulatedReply } : msg
                  ))
                }

                if (data.done) {
                  // Real-time update logic:
                  const taskKeywords = ['created', 'updated', 'deleted', 'marked', 'completed', 'list']
                  if (taskKeywords.some(k => accumulatedReply.toLowerCase().includes(k))) {
                    queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
                    queryClient.invalidateQueries({ queryKey: taskKeys.stats() })

                    // Also invalidate categories if mentioned
                    if (accumulatedReply.toLowerCase().includes('category')) {
                      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
                    }
                  }

                  if (data.exit_session) {
                    setTimeout(() => onClose(), 2000)
                  }
                }

                if (data.error) {
                   throw new Error(data.error)
                }
              } catch (e) {
                // Ignore parse errors from partial lines
              }
            }
          }
        }
      }

    } catch (error) {
      console.error('Chat error:', error)
      setMessages((prev) => prev.map(msg =>
        msg.id === assistantMessageId
          ? { ...msg, content: 'Sorry, I encountered an error processing your request.' }
          : msg
      ))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-20 right-6 w-96 h-[500px] bg-white border border-gray-200 rounded-lg shadow-2xl flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
        <h3 className="font-semibold">Todo AI Assistant</h3>
        <button onClick={onClose} className="hover:bg-blue-700 p-1 rounded transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Message List */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            <p className="text-sm">Hello! How can I help you manage your tasks today?</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-gray-100 text-gray-800 rounded-bl-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none animate-pulse">
              <span className="flex space-x-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const form = e.target as HTMLFormElement
          const input = form.elements.namedItem('message') as HTMLInputElement
          handleSendMessage(input.value)
          form.reset()
        }}
        className="p-4 border-t border-gray-100 flex space-x-2"
      >
        <input
          name="message"
          type="text"
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoComplete="off"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  )
}
