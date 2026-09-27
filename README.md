# CodeCanvas

> AI-powered platform for generating and previewing React applications from natural language.

CodeCanvas is a full-stack AI web application that allows users to describe an application in natural language and generate a working React project from that description.

The generated project can be explored, edited, and previewed directly in the browser. Users can also export their generated project or deploy it through the integrated workflow.

---

## 🚀 Features

- 🤖 **AI Code Generation**
  - Generate React projects using natural language prompts
  - Powered by Google Gemini

- 💬 **AI Chat**
  - Interact with the AI while building a project
  - Chat history is stored with the workspace

- 🧑‍💻 **Live Code Editor**
  - Browse generated project files
  - Edit and explore the generated code directly in the browser

- 👀 **Live Preview**
  - Instantly preview generated React applications
  - Powered by CodeSandbox Sandpack

- 📁 **Workspace Management**
  - Each project has its own workspace
  - Generated files and conversations are stored for later access

- 🔐 **Google Authentication**
  - Secure sign-in using Google OAuth

- 💳 **Token-based System**
  - Users receive tokens for AI generation
  - Additional tokens can be purchased through Stripe

- 💰 **Stripe Payments**
  - Stripe Checkout integration
  - Secure payment confirmation through Stripe webhooks

- 📤 **Export**
  - Export generated projects to CodeSandbox

- 🚀 **Deploy**
  - Generate a shareable deployed preview from the generated project

- 🌙 **Dark UI**
  - Modern developer-focused interface
  - Built with Tailwind CSS and shadcn/ui

---

## 🛠️ Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React

### Backend & Database

- Next.js API Routes
- Convex
- TypeScript

### AI

- Google Gemini
- `@google/genai`

### Code Generation & Preview

- CodeSandbox Sandpack

### Authentication

- Google OAuth

### Payments

- Stripe Checkout
- Stripe Webhooks

### Developer Tools

- Git
- GitHub
- Axios
- Vercel

---

## 🏗️ How It Works

```text
User Prompt
     │
     ▼
 AI Chat
     │
     ▼
Google Gemini
     │
     ▼
Generated Project Files
     │
     ▼
Convex Workspace
     │
     ├── Code Editor
     │
     └── Live Preview
             │
             ├── Export
             │
             └── Deploy
