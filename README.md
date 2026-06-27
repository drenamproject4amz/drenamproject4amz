# 🚀 Drenam Project - Automation

A TypeScript + React automation application powered by Google Gemini AI, built with Vite and TailwindCSS.

## 📋 Features

- **React 19** - Modern UI framework
- **Vite 6** - Lightning-fast build tool
- **TypeScript** - Type-safe development
- **Google Gemini AI** - Intelligent automation capabilities
- **TailwindCSS** - Utility-first styling
- **Express Server** - Backend support
- **Firebase Integration** - Database & authentication
- **Recharts** - Data visualization
- **Lucide React** - Beautiful icons

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+ (20+ recommended)
- npm 9+ or yarn

### Installation
```bash
# Clone and setup
git clone https://github.com/drenamproject4amz/drenamproject4amz.git
cd drenamproject4amz
npm install

# Configure environment
cp .env.example .env
# Edit .env and add your Google API key

# Launch
npm run dev
```

The app opens at `http://localhost:3000`

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Check TypeScript types |
| `npm run clean` | Remove build artifacts |

## 🏗️ Project Structure

```
src/
├── App.tsx              # Main component
├── main.tsx             # Entry point
├── index.css            # Global styles
├── components/          # React components
├── hooks/
│   └── useGemini.ts    # AI integration hook
├── services/
│   └── gemini.ts       # Gemini AI service
└── utils/              # Utilities
```

## 🤖 Using Gemini AI

```typescript
import { useGemini } from './hooks/useGemini'

function MyComponent() {
  const { sendMessage, loading } = useGemini()

  return (
    <button onClick={() => sendMessage('Hello!')}>
      {loading ? 'Thinking...' : 'Ask AI'}
    </button>
  )
}
```

## 📚 Documentation

- [Getting Started Guide](./GETTING_STARTED.md)
- [Vite Docs](https://vitejs.dev/)
- [React Docs](https://react.dev/)
- [Google Gemini API](https://ai.google.dev/)

## 🚀 Deployment

Build production-ready files:
```bash
npm run build
```

Deploy the `dist/` folder to:
- GitHub Pages
- Vercel
- Netlify
- Firebase Hosting
- Any static host

## 📄 License

Free and open source

---

**Ready to automate? Let's go! 🎉**