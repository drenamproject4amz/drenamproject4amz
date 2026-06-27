# 🚀 Getting Started with Drenam Project

This guide will walk you through setting up and launching the Drenam Project automation app.

## Prerequisites

Before you begin, make sure you have:

- **Node.js** 18+ (20+ recommended)
- **npm** 9+ or yarn
- **Git**
- A Google API key for Gemini AI (optional but recommended)

## Step-by-Step Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/drenamproject4amz/drenamproject4amz.git
cd drenamproject4amz
```

### 2️⃣ Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React 19
- Vite 6
- TypeScript
- TailwindCSS
- Google Gemini AI
- Express
- Firebase

### 3️⃣ Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your keys:

```env
# Required: Get from https://ai.google.dev/
VITE_GOOGLE_API_KEY=your_api_key_here

# Optional: Add other configuration as needed
VITE_APP_NAME=Drenam Project
VITE_API_BASE_URL=http://localhost:3000
```

### 4️⃣ Launch the Application

#### Development Mode (Recommended for first-time setup)

```bash
npm run dev
```

**Output:**
```
  VITE v6.2.3  ready in 234 ms

  ➜  Local:   http://localhost:3000/
  ➜  Press h + enter to show help
```

Your browser will automatically open to `http://localhost:3000`

#### Or Run Specific Commands

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Run TypeScript type checking
npm run lint

# Clean build artifacts
npm run clean
```

## 🎯 Development Workflow

### Making Changes

1. Edit files in the `src/` directory
2. Changes will **hot-reload** automatically
3. Check for TypeScript errors: `npm run lint`
4. Test in your browser

### Project Structure

```
src/
├── App.tsx                 # Main app component
├── main.tsx               # React entry point
├── index.css              # Global styles
├── components/            # Reusable React components
├── hooks/                 # Custom React hooks
│   └── useGemini.ts      # Gemini AI hook
├── services/              # API services
│   └── gemini.ts         # Gemini AI service
└── utils/                 # Utility functions
```

### Using Gemini AI

Example: Send a message to Gemini

```typescript
import { useGemini } from './hooks/useGemini'

function MyComponent() {
  const { sendMessage, loading, error } = useGemini()

  const handleAsk = async () => {
    try {
      const response = await sendMessage('What is automation?')
      console.log(response)
    } catch (err) {
      console.error('Error:', err)
    }
  }

  return (
    <button onClick={handleAsk} disabled={loading}>
      {loading ? 'Thinking...' : 'Ask AI'}
    </button>
  )
}
```

### Adding Components

Create a new component in `src/components/`:

```typescript
// src/components/MyComponent.tsx
export function MyComponent() {
  return (
    <div className="card">
      <h2>My Component</h2>
      <p>This is a reusable component</p>
    </div>
  )
}
```

Then import and use it:

```typescript
import { MyComponent } from './components/MyComponent'

function App() {
  return <MyComponent />
}
```

## 🧪 Building for Production

### Create a Production Build

```bash
npm run build
```

This generates an optimized `dist/` folder with:
- Minified JavaScript
- Optimized CSS
- Tree-shaken dependencies
- Source maps for debugging

### Preview Production Locally

```bash
npm run preview
```

### Deploy

The `dist/` folder can be deployed to:

- **GitHub Pages** - Free, integrated with GitHub
- **Vercel** - Automatic deployments from git
- **Netlify** - Easy drag-and-drop deployment
- **Firebase Hosting** - Full backend support
- **Any static host** - AWS S3, Azure, etc.

## ⚙️ Configuration Files

### `vite.config.ts`
- Server port: 3000
- Build output: `dist/`
- React plugin enabled

### `tsconfig.json`
- Target: ES2022
- JSX: React 19
- Strict type checking

### `tailwind.config.js`
- Custom color palette
- Extended animations
- Responsive utilities

## 🐛 Troubleshooting

### Port 3000 Already in Use

```bash
# Use a different port
npm run dev -- --port=3001
```

### Dependencies Not Installing

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Check types
npm run lint

# Build the project
npm run build
```

### Hot Reload Not Working

```bash
# Restart the dev server
npm run dev
```

### Environment Variables Not Loading

```bash
# Make sure .env file exists in root directory
# Restart dev server after adding new variables
npm run dev
```

## 📚 Learn More

- [Vite Docs](https://vitejs.dev/)
- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/)
- [TailwindCSS Docs](https://tailwindcss.com/)
- [Google Gemini API](https://ai.google.dev/)

## 🤝 Need Help?

Check these resources:
- 📖 [README.md](./README.md) - Overview and features
- 🐛 [Create an Issue](https://github.com/drenamproject4amz/drenamproject4amz/issues) - Report bugs
- 💬 [Discussions](https://github.com/drenamproject4amz/drenamproject4amz/discussions) - Ask questions

---

**Happy coding! 🎉**
