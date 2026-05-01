# Snip — URL Shortener

> A fast, modern, full-featured URL shortener with custom slugs, analytics, and user authentication.

> [![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://reactjs.org/) , [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/) , [![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite)](https://vitejs.dev/)

---

## Overview

**Snip** is a URL shortener that lets users shorten long URLs, set custom slugs, track link performance, and manage all their links from a clean dashboard. Built with a modern React frontend and a RESTful backend, it prioritizes speed, usability, and security.

**Live Demo:** [https://urlshortner-lzyy.onrender.com/](https://urlshortner-lzyy.onrender.com/)

<p align="center">
  <img src="/public/images/LandingPageDark.png" alt="Snip URL Shortener Banner" width="600" />
</p>

---

## Features

- **URL Shortening** — Instantly shorten any valid URL
- **Custom Slugs** — Choose your own short URL alias
- **User Authentication** — Secure sign-up/login; each user manages their own links
- **OAuth (Google and GitHub) support** — Users can log in and sign up using Google or GitHub
- **Link Dashboard** — View, edit, and delete all your shortened URLs in one place
- **Live Preview** — Real-time preview of the shortened URL as you type
- **Form Validation** — Schema-driven validation with Zod and React Hook Form
- **Copy to Clipboard** — One-click copy for any short URL
- **Optimistic UI** — Instant feedback with React Query mutations
- **Share Links** — Share the url links to others
- **Secure URLs** — All shortened URLs are checked for safety, with clear warnings for potentially unsafe links
- **Responsive Design** — Mobile-first, works on all screen sizes
- **Dark/Light Mode** - Supports Dark/Light/System mode across all the pages

---

## Tech Stack

### Frontend

| Technology                                      | Purpose                 |
| ----------------------------------------------- | ----------------------- |
| [React 19](https://reactjs.org/)                | UI framework            |
| [TypeScript](https://www.typescriptlang.org/)   | Type safety             |
| [Vite](https://vitejs.dev/)                     | Build tool & dev server |
| [React Hook Form](https://react-hook-form.com/) | Form state management   |
| [Zod](https://zod.dev/)                         | Schema validation       |
| [TanStack Query](https://tanstack.com/query)    | Server state & caching  |
| [Sonner](https://sonner.emilkowal.ski/)         | Toast notifications     |
| [Tailwind CSS](https://tailwindcss.com/)        | Utility-first styling   |
| [Shadcn UI](https://ui.shadcn.com/)             | UI Components           |

### Backend

| Technology                                            | Purpose             |
| ----------------------------------------------------- | ------------------- |
| [Supabase](https://supabase.com/) _(or your backend)_ | Database, Auth, API |

---

## Project Structure

```
snip/
├── public/                  # Static assets
├── src/
│   ├── components/
│   │   ├── ui/              # Base UI components (Input, Button, Card, etc.)
│   │   └── forms/           # Feature forms (EditLinkForm, CreateLinkForm, etc.)
|   |   └── charts/          # Link charts (Pie Charts, Location Stats Chart)
|   |   └── dialogs/         # Dialogs (CreateLinkDialog, ViewQrDialog, etc.)
│   ├── context/
│   │   └── auth-context.tsx # Global auth state via React Context
│   ├── hooks/
│   │   ├── useEditUrl.ts    # Mutation hook for editing a URL
│   │   ├── useCreateUrl.ts  # Mutation hook for creating a URL
│   │   ├── useDeleteUrl.ts  # Mutation hook for deleting a URL
│   │   └── useUrls.ts       # Query hook for fetching user URLs
│   │   └── useClicks.ts     # Query hook for fetching clicks per url
│   │   └── useDebounce.ts   # Debounce functionality
│   │   └── useRealtimeUrls.ts   # Supabase Realtime Subscription for getting url
│   │   └── useRealtimeClickss.ts   # Supabase Realtime Subscription for getting clicks
│   ├── schema/
│   │   └── form-schema.ts   # Zod schemas for all forms
│   ├── layouts/
│   │   └── app-layout.tsx   # Whole app layout
│   ├── skeletons/           # All Skeletons for loading states
│   ├── types/               # All types used in the project
│   ├── lib/
│   │   └── helper.ts   # Helpful reusable helper function
│   │   └── utils.ts
│   ├── pages/               # Route-level page components
│   ├── lib/                 # Utility functions & API clients
│   ├── App.tsx
│   └── main.tsx
├── .env.example             # Example environment variable template
├── .eslintrc.json
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) `>= 18.x`
- [npm](https://www.npmjs.com/) `>= 9.x` or [pnpm](https://pnpm.io/) `>= 8.x`
- A [Supabase](https://supabase.com/) account _(or your own backend)_

---

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/AnishGane/URLShortner.git
cd snip

# 2. Install dependencies
npm install
# or
pnpm install
```

---

### Environment Variables

Create a `.env` file in the project root by copying the example:

```bash
cp .env.example .env
```

Then fill in the values:

```env
# App
VITE_APP_URL=http://localhost:5173/

# Supabase (or your backend)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key-here
```

---

### Running Locally

```bash
# Start the development server
npm run dev or pnpm dev

# The app will be available at:
# http://localhost:5173
```

---

## Scripts

| Script                        | Description                               |
| ----------------------------- | ----------------------------------------- |
| `npm run dev or pnpm dev`     | Start the Vite dev server with HMR        |
| `npm run build or pnpm build` | Build for production (outputs to `dist/`) |

---

## Authentication

Authentication is handled via **[Supabase Auth](https://supabase.com/docs/guides/auth)**

- JWT-based sessions are stored securely in the browser
- All protected routes and API mutations require a valid user session
- The `useAuthContext` hook exposes the current `user` object throughout the app

---

## Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch: `git checkout -b feat/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add some feature'`
4. Push to the branch: `git push origin feat/your-feature-name`
5. Open a Pull Request
   Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## Author

Anish Gane
GitHub: [AnishGane](https://github.com/AnishGane)  
Email: anishgane10@gmail.com

---

<p align="center">Made with ❤️ and too many short URLs</p>
