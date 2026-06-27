import { GoogleGenerativeAI } from '@google/genai'

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY

if (!apiKey) {
  console.warn('VITE_GOOGLE_API_KEY is not set in environment variables')
}

const client = new GoogleGenerativeAI({
  apiKey: apiKey || '',
})

export interface GeminiMessage {
  role: 'user' | 'assistant'
  content: string
}

/**
 * Send a message to Google Gemini AI and get a response
 */
export async function sendMessage(prompt: string): Promise<string> {
  try {
    if (!apiKey) {
      throw new Error('Google API key is not configured')
    }

    const model = client.getGenerativeModel({ model: 'gemini-pro' })
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return text
  } catch (error) {
    console.error('Gemini API Error:', error)
    throw error
  }
}

/**
 * Start a multi-turn conversation with Gemini
 */
export async function startConversation() {
  if (!apiKey) {
    throw new Error('Google API key is not configured')
  }

  const model = client.getGenerativeModel({ model: 'gemini-pro' })
  const chat = model.startChat({
    history: [],
  })

  return {
    /**
     * Send a message in the conversation
     */
    async send(message: string): Promise<string> {
      try {
        const result = await chat.sendMessage(message)
        const response = await result.response
        return response.text()
      } catch (error) {
        console.error('Chat Error:', error)
        throw error
      }
    },

    /**
     * Get the current conversation history
     */
    getHistory(): GeminiMessage[] {
      return chat.getHistory().map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.parts[0]?.text || '',
      }))
    },
  }
}

export default {
  sendMessage,
  startConversation,
}