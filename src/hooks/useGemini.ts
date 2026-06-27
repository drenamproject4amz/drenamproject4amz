import { useState, useCallback } from 'react'
import { sendMessage as geminiSendMessage, startConversation, GeminiMessage } from '../services/gemini'

interface UseGeminiOptions {
  onError?: (error: Error) => void
}

/**
 * Hook for interacting with Google Gemini AI
 */
export function useGemini(options?: UseGeminiOptions) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const sendMessage = useCallback(async (prompt: string): Promise<string> => {
    setLoading(true)
    setError(null)

    try {
      const response = await geminiSendMessage(prompt)
      return response
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      options?.onError?.(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [options])

  return {
    sendMessage,
    loading,
    error,
  }
}

/**
 * Hook for multi-turn conversations with Gemini
 */
export function useGeminiChat(options?: UseGeminiOptions) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [messages, setMessages] = useState<GeminiMessage[]>([])
  const [chat, setChat] = useState<any>(null)

  const initChat = useCallback(async () => {
    try {
      const newChat = await startConversation()
      setChat(newChat)
      setMessages([])
      setError(null)
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      options?.onError?.(error)
    }
  }, [options])

  const sendMessage = useCallback(
    async (message: string): Promise<string> => {
      if (!chat) {
        const err = new Error('Chat not initialized. Call initChat() first.')
        setError(err)
        options?.onError?.(err)
        throw err
      }

      setLoading(true)
      setError(null)

      try {
        // Add user message
        setMessages((prev) => [...prev, { role: 'user', content: message }])

        // Get response
        const response = await chat.send(message)

        // Add assistant response
        setMessages((prev) => [...prev, { role: 'assistant', content: response }])

        return response
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        setError(error)
        options?.onError?.(error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [chat, options],
  )

  return {
    chat,
    messages,
    loading,
    error,
    initChat,
    sendMessage,
  }
}