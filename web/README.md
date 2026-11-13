# TaskFlow Frontend Web Application

A modern, responsive Task Management dashboard built with **Next.js 16 (App Router)**, **React 19**, **TanStack Query v5**, **shadcn/ui**, and **Zod** schema validation.

---

## 🏛️ Architecture & Folder Structure

The frontend code resides in `web/src/` organized into clean, modular feature domains:

```
src/
├── app/                      # Next.js App Router (Layout, Providers, Page, CSS)
│   ├── layout.tsx            # Root HTML layout with Font & Provider tree
│   ├── page.tsx              # Main Tasks dashboard page
│   └── globals.css           # Tailwind v4 theme tokens & shadcn variables
├── components/
│   ├── providers/            # QueryClientProvider & ToastProvider
│   ├── tasks/                # Feature-scoped Task components
│   │   ├── task-table.tsx            # Tasks table with pulse skeleton loading
│   │   ├── task-form-dialog.tsx      # Create and edit task modal dialog
│   │   ├── task-delete-dialog.tsx    # Accessible delete confirmation dialog
│   │   ├── task-filter-bar.tsx       # Status dropdown, sort button, action bar
│   │   ├── task-status-badge.tsx     # Color-coded status badges (TODO, IN_PROGRESS, DONE)
│   │   └── task-empty-state.tsx      # Empty state with actionable create button
│   └── ui/                   # shadcn/ui base primitives (Base UI + Tailwind)
│       ├── button.tsx, input.tsx, textarea.tsx, select.tsx
│       ├── badge.tsx, table.tsx, dialog.tsx, alert-dialog.tsx, toast.tsx
├── config/                   # Fail-fast Zod-validated environment config (env.ts)
├── hooks/
│   ├── use-tasks.ts          # TanStack Query orchestration hook
│   └── use-toast.ts          # Floating toast notification hook
├── schemas/                  # Endpoint-wise Zod validation schemas
│   ├── create-task.schema.ts # Creation validation rules & types
│   ├── update-task.schema.ts # Partial update validation rules & types
│   ├── query-task.schema.ts  # Filter & sorting query validation & sanitizer
│   └── index.ts              # Exports schemas & formatZodErrors helper
├── services/
│   └── task-api.ts           # Centralized HTTP fetch client for /api/v1/tasks
└── types/
    └── task.types.ts         # TypeScript domain models and API envelope types
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

| Variable | Type | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | `string` | `http://localhost:5000` | Backend API base URL |

> **Fail-Fast Validation**: The environment is validated at load time using Zod in `src/config/env.ts`. If `NEXT_PUBLIC_API_URL` is omitted or not a valid URL, the application fails fast with clear instructions on how to fix it.

---

## 📦 Getting Started

### Prerequisites
- **Node.js**: `v24.x` (or `v22+` via NVM)
- **Package Manager**: `npm` (`v10+` / `v11+`)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open your browser at: [http://localhost:3000](http://localhost:3000).

---

## ⚡ Key Features & Engineering Highlights

### 1. TanStack Query v5 Data Fetching & Caching
- **Declarative Queries**: `useQuery` automatically manages caching, loading indicators, and error states.
- **Race Condition Prevention**: Prevents out-of-order network responses when rapidly switching status filters or sorting orders.
- **Automatic Cache Invalidation**: `createMutation`, `updateMutation`, and `deleteMutation` automatically call `queryClient.invalidateQueries({ queryKey: ['tasks'] })`, instantly updating the UI without manual state management.
- **Optimized Hook**: The `useTasks` hook abstracts all server queries and mutation handlers, exposing a clean, reactive API contract to the page component.

### 2. Form & Schema Validation (Zod)
- Declarative validation schemas enforce:
  - `title`: Required, trimmed, 1 to 255 characters.
  - `description`: Optional, trimmed, max 1000 characters.
  - `status`: Validated against `TODO`, `IN_PROGRESS`, `DONE`.
  - `dueDate`: Validated as an ISO date string.
- In `TaskFormDialog`, submissions execute `createTaskSchema.safeParse(...)` / `updateTaskSchema.safeParse(...)`. Field-specific validation errors are rendered directly under the corresponding inputs.

### 3. Accessible Dialogs & React 19 Optimization
- Both `TaskFormDialog` and `TaskDeleteDialog` use React 18/19's `useSyncExternalStore` for client-only portal rendering, completely eliminating cascading render warnings.
- Delete operations require explicit confirmation via an accessible `AlertDialog`.

### 4. Tailwind CSS v4 & Modern Theming
- Uses Tailwind CSS v4 `@theme inline` mapping to modern `oklch` color definitions in `src/app/globals.css`.
- Fully supports light and dark themes.

---

## 📜 Available NPM Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Next.js development server with Turbopack |
| `npm run build` | Create an optimized standalone production build |
| `npm run start` | Start the production server from compiled build |
| `npm run lint` | Run ESLint check across all frontend code |
