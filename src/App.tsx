import React from 'react'
import { Zap } from 'lucide-react'

function App() {
  const [count, setCount] = React.useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <Zap className="text-primary-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-900">Drenam Project</h1>
          </div>
          <p className="text-gray-600 mt-2">TypeScript Automation with AI</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Card */}
        <div className="card mb-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome! 🎉</h2>
          <p className="text-gray-600 mb-6">
            This is your automation app powered by Google Gemini AI, built with React, Vite, and TypeScript.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setCount(count + 1)}
              className="btn-primary"
            >
              Click Count: {count}
            </button>
            <button
              onClick={() => setCount(0)}
              className="btn-secondary"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">⚡ Fast</h3>
            <p className="text-gray-600">Built with Vite for lightning-fast development and production builds.</p>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold mb-2">🤖 AI-Powered</h3>
            <p className="text-gray-600">Integrated with Google Gemini AI for intelligent automation capabilities.</p>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold mb-2">🎨 Beautiful</h3>
            <p className="text-gray-600">Styled with TailwindCSS for a modern, responsive design.</p>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold mb-2">📱 Responsive</h3>
            <p className="text-gray-600">Fully responsive design that works on all devices and screen sizes.</p>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold mb-2">🔒 Type-Safe</h3>
            <p className="text-gray-600">Written in TypeScript for better code quality and development experience.</p>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold mb-2">🚀 Production-Ready</h3>
            <p className="text-gray-600">Optimized for production with automated CI/CD pipelines.</p>
          </div>
        </div>

        {/* Getting Started */}
        <div className="card mt-8">
          <h2 className="text-2xl font-bold mb-4">🚀 Getting Started</h2>
          <div className="bg-gray-50 rounded p-4 font-mono text-sm text-gray-800 overflow-x-auto space-y-2">
            <div>$ npm run dev</div>
            <div className="text-gray-500"># Development server starts on http://localhost:3000</div>
          </div>
          <p className="text-gray-600 mt-4">
            Edit <code className="bg-gray-100 px-2 py-1 rounded">src/App.tsx</code> to get started. Changes will reflect instantly with hot module reloading!
          </p>
        </div>

        {/* Documentation Links */}
        <div className="card mt-8">
          <h2 className="text-2xl font-bold mb-4">📚 Resources</h2>
          <ul className="space-y-2">
            <li>
              <a href="https://vitejs.dev/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 font-medium">
                → Vite Documentation
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 font-medium">
                → React Documentation
              </a>
            </li>
            <li>
              <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 font-medium">
                → Google Gemini AI
              </a>
            </li>
            <li>
              <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 font-medium">
                → TailwindCSS
              </a>
            </li>
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="mb-2">Drenam Project • Free & Open Source</p>
          <p className="text-gray-400">Made with ❤️ using React, Vite & TypeScript</p>
        </div>
      </footer>
    </div>
  )
}

export default App