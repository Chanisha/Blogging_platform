# BlogHub - Modern Blogging Platform

A full-stack blogging platform built with Next.js, featuring a modern UI, real-time post management, and comprehensive CRUD operations with type-safe API communication.

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, PostgreSQL, Drizzle ORM
- **API Communication**: tRPC for type-safe client-server communication
- **Database**: PostgreSQL with connection pooling
- **Styling**: Tailwind CSS with custom components
- **Icons**: Lucide React
- **Development**: Hot reload, TypeScript strict mode

## 📋 Features Implemented

### ✅ Priority 1 Features (Core Functionality)
- [x] **Post Creation & Management**
  - Rich text editor for post content
  - Title, content, excerpt, and tags
  - Draft and published post states
  - Automatic slug generation
- [x] **User Authentication**
  - Login/Register functionality
  - Session management with localStorage
  - User dashboard access
- [x] **Post CRUD Operations**
  - Create new posts
  - Read/View posts
  - Update existing posts
  - Delete posts (with confirmation)
- [x] **Dashboard Interface**
  - Post management interface
  - Filter by published/draft status
  - Search functionality
  - Real-time post updates
- [x] **Type-Safe API Communication**
  - tRPC integration for end-to-end type safety
  - Automatic client-side type inference
  - Runtime validation with Zod schemas

### ✅ Priority 2 Features (Enhanced UX)
- [x] **Responsive Design**
  - Mobile-first approach
  - Responsive navigation
  - Adaptive layouts
- [x] **Post Status Management**
  - Publish/Unpublish toggle
  - Draft saving
  - Status indicators
- [x] **Search & Filter**
  - Search posts by title/content
  - Filter by publication status
  - Sort by date/views
- [x] **User Experience**
  - Loading states
  - Error handling
  - Confirmation dialogs
- [x] **Real-time Updates**
  - TanStack Query integration
  - Optimistic updates
  - Cache invalidation

### ✅ Priority 3 Features (Advanced Features)
- [x] **Database Integration**
  - PostgreSQL with Drizzle ORM
  - Connection pooling
  - Data validation
- [x] **API Architecture**
  - RESTful API design with tRPC layer
  - Error handling
  - Request validation
- [x] **Type Safety**
  - Full TypeScript implementation
  - End-to-end type safety with tRPC
  - Interface definitions
- [x] **Rich Text Editing**
  - Tiptap editor integration
  - Markdown support
  - Real-time preview

## 🛠️ Setup Steps (How to Run Locally)

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd blogging
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/blogging_db"
   ```

4. **Set up the database**
   ```bash
   # Run database migrations
   npm run db:push
   
   # Test database connection
   npm run db:test
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Open [http://localhost:3000](http://localhost:3000)
   - Create an account or login
   - Start creating posts!

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema
- `npm run db:studio` - Open Drizzle Studio
- `npm run db:test` - Test database connection

## 🏗️ Project Structure
src/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   ├── posts/         # Post CRUD endpoints
│   │   └── trpc/          # tRPC API routes
│   ├── create/            # Post creation page
│   ├── dashboard/         # User dashboard
│   └── page.tsx           # Home page
├── components/
│   ├── MarkdownEditor.tsx # Rich text editor (Tiptap)
│   └── Navbar.tsx         # Navigation component
├── lib/
│   ├── db/
│   │   ├── index.ts       # Database connection
│   │   └── schema.ts      # Database schema
│   └── trpc/
│       ├── client.ts      # tRPC client configuration
│       ├── server.ts      # tRPC server setup
│       └── router.ts      # API router definitions
└── types/
    └── react.d.ts         # TypeScript declarations
