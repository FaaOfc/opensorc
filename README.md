⚡ TaoSite
Super-efficient multifunction web app — an 8-in-1 tool suite built with Next.js 16, featuring CDN hosting, URL shortener, social media downloaders, AI chat, AI waifu roleplay, and AI image generation. All wrapped in a bold Neobrutalism UI.
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-6-2d3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-✓-4169e1?logo=postgresql)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
---
✨ Features
#	Feature	Description
1	CDN Hosting	Upload any file to GitHub repo, serve via custom domain with proper MIME types. Drag & drop support.
2	URL Shortener	Shorten URLs with custom codes, stored in GitHub Gist — zero-cost database.
3	TikTok Downloader	Download TikTok videos without watermark, photo slides, and MP3 audio.
4	Instagram Downloader	Download Reels, post videos, single & carousel photos.
5	Facebook Downloader	Download Facebook videos in SD and HD quality.
6	AI Chat	Free chat with 24 premium AI models (GPT-5.5, Claude Opus 4.8, Gemini 3.1, Grok 4.1, and more).
7	AI Waifu	Roleplay chat with anime character presets (Hu Tao, Nahida, Ai Hoshino, Zero Two, Marin, Shinobu) or custom characters.
8	AI Image Generator	Generate images from text prompts with 10-second cooldown to prevent abuse.
---
🎨 Design
NefuSite uses a Neobrutalism design system — a bold, functional aesthetic with:
2px black borders on all interactive elements
Hard offset box shadows (5px 5px) for depth
Monospace typography (Geist Mono) throughout
Press-in button effect on click (translate + shadow removal)
Light / Dark mode toggle with CSS variable theming
Responsive layout — desktop sidebar + mobile hamburger drawer
---
🛠️ Tech Stack
Layer	Technology
Framework	Next.js 16 (App Router)
Language	TypeScript 5
Styling	Tailwind CSS 4 + custom Neobrutalism CSS
UI Library	shadcn/ui (new-york variant) + Radix UI
Icons	Lucide React
Database	PostgreSQL via Prisma 6
Auth	bcryptjs (manual hash/compare)
State	Zustand + React Query + localStorage
Animation	Framer Motion + custom CSS animations
Runtime	Bun
Reverse Proxy	Caddy
---
📁 Project Structure
```
NefuSite/
├── prisma/
│   └── schema.prisma          # Database schema (User, Chat, Message)
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout (Geist fonts, ThemeProvider, Sidebar)
│   │   ├── page.tsx           # Homepage with feature carousel
│   │   ├── globals.css        # Tailwind + Neobrutalism custom styles
│   │   ├── cdn/page.tsx       # CDN file hosting
│   │   ├── short/page.tsx     # URL shortener
│   │   ├── ttdl/page.tsx      # TikTok downloader
│   │   ├── igdl/page.tsx      # Instagram downloader
│   │   ├── fbdl/page.tsx      # Facebook downloader
│   │   ├── chat/page.tsx      # AI Chat (24 models)
│   │   ├── ai-waifu/page.tsx  # AI Waifu roleplay
│   │   ├── imagen/page.tsx    # AI Image generator
│   │   └── api/
│   │       ├── shorten/route.ts
│   │       ├── igdl/route.ts
│   │       ├── ttdl/route.ts
│   │       ├── fbdl/route.ts
│   │       ├── chat/route.ts
│   │       ├── waifu/route.ts
│   │       ├── imagen/route.ts
│   │       ├── chats/route.ts
│   │       └── auth/
│   │           ├── register/route.ts
│   │           ├── login/route.ts
│   │           └── me/route.ts
│   ├── components/
│   │   ├── sidebar.tsx        # Main navigation sidebar
│   │   ├── navbar.tsx         # Alternative top navbar
│   │   └── ui/                # shadcn/ui components (40+)
│   ├── lib/
│   │   ├── config.ts          # Site configuration
│   │   ├── db.ts              # Prisma client singleton
│   │   └── utils.ts           # cn() utility
│   └── hooks/
│       ├── use-mobile.ts      # Mobile breakpoint hook
│       └── use-toast.ts       # Toast notification hook
├── public/
│   └── logo.svg
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── components.json            # shadcn/ui config
├── Caddyfile                  # Caddy reverse proxy config
└── README.md
```
---
🗄️ Database Schema
```
User ──< Chat ──< Message
  • id (cuid)       • id (cuid)         • id (cuid)
  • username (uniq) • userId (FK)        • chatId (FK)
  • name             • title             • role ("user" | "assistant")
  • email (uniq)     • createdAt          • content
  • password (hash)  • updatedAt          • createdAt
  • createdAt/UpdatedAt
```
---
🚀 Getting Started
Prerequisites
Bun (recommended) or Node.js 18+
PostgreSQL database
GitHub Personal Access Token (for CDN & URL shortener)
Installation
```bash
# Clone the repository
git clone https://github.com/alip-jmbd/NefuSite.git
cd NefuSite

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```
Environment Variables
Create a `.env` file in the project root:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/nefusite"
DIRECT_URL="postgresql://user:password@localhost:5432/nefusite"

# GitHub API (for CDN & URL shortener)
GITHUB_TOKEN="ghp_your_personal_access_token"
GITHUB_USERNAME="your-username"
GITHUB_REPO="your-cdn-repo"
GIST_ID="your-gist-id-for-url-shortener"

# Site
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```
Database Setup
```bash
# Generate Prisma client
bun run db:generate

# Push schema to database
bun run db:push

# Or run migrations
bun run db:migrate
```
Development
```bash
# Start development server
bun run dev
```
Open http://localhost:3000 in your browser.
Production Build
```bash
# Build for production
bun run build

# Start production server
bun run start
```
---
🔌 API Routes
Endpoint	Method	Description
`/api`	GET	Health check
`/api/shorten`	POST	Shorten URL (stores in GitHub Gist)
`/api/ttdl`	GET	TikTok video/photo/audio download
`/api/igdl`	GET	Instagram media download
`/api/fbdl`	POST	Facebook video download (SD/HD)
`/api/chat`	GET	List available AI models
`/api/chat`	POST	Send chat message to AI model
`/api/waifu`	POST	AI Waifu roleplay conversation
`/api/imagen`	POST	Generate image from text prompt
`/api/chats`	GET	List persisted chat sessions
`/api/chats`	DELETE	Delete a chat session
`/api/auth/register`	POST	Register new user
`/api/auth/login`	POST	Login user
`/api/auth/me`	GET	Get current user info
---
🧩 Neobrutalism CSS Classes
The custom design system provides these utility classes:
Class	Effect
`.neo-border`	2px solid border with theme-aware color
`.neo-shadow`	5px 5px offset shadow
`.neo-shadow-sm`	3px 3px offset shadow
`.neo-btn`	Combined border + shadow + press-in effect
`.neo-card`	Combined border + shadow + rounded card
`.bg-dots`	Dot pattern background
`.animate-slide-up`	Slide-up entrance animation
`.animate-fade-in-up`	Chat message fade-in animation
---
📱 Responsive Design
Desktop (≥640px): Fixed left sidebar (208px) with full navigation
Mobile (<640px): Top bar with hamburger menu + slide-out drawer overlay
All pages use `max-w-2xl` centered layout for comfortable reading width
---
🌙 Dark Mode
Dark mode is implemented via CSS variables with `next-themes`:
Toggle button in the sidebar footer
All Neobrutalism classes automatically adapt (borders, shadows, backgrounds)
Persists user preference in localStorage
---
📦 Key Dependencies
```json
{
  "next": "^16.1.1",
  "react": "^19.0.0",
  "typescript": "^5",
  "tailwindcss": "^4",
  "@prisma/client": "^6.11.1",
  "lucide-react": "^0.525.0",
  "framer-motion": "^12.23.2",
  "zustand": "^5.0.6",
  "@tanstack/react-query": "^5.82.0",
  "react-hook-form": "^7.60.0",
  "zod": "^4.0.2",
  "react-markdown": "^10.1.0",
  "recharts": "^2.15.4",
  "bcryptjs": "^3.0.3",
  "next-themes": "^0.4.6",
  "sonner": "^2.0.6"
}
```
---
🚀 Deployment
With Caddy (Recommended)
The project includes a `Caddyfile` for reverse proxy:
```
:81 {
  reverse_proxy localhost:3000
}
```
```bash
# Build and start Next.js
bun run build
bun run start

# Start Caddy
caddy run
```
With Vercel
```bash
vercel deploy
```
Make sure to set all environment variables in the Vercel dashboard.
---
📄 License
This project is private and not open for redistribution.
---
<p align="center">
  Built with ⚡ by <strong>FaaOf    c</strong>
</p>
