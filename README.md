# TaskFlow - Full Stack Task Manager

TaskFlow is a modern, production-grade Task Manager application built with a **NestJS** backend and a **Next.js** frontend.

---

## 📁 Project Structure

```
.
├── api/                  # NestJS REST API (Prisma 7 + PostgreSQL)
│   ├── prisma/           # Schema & migrations
│   ├── src/              # Modular backend source (Tasks domain, Repository, Config)
│   └── prisma.config.ts  # Prisma CLI configuration
├── web/                  # Next.js App Router Frontend (shadcn/ui + Tailwind CSS)
│   ├── src/
│   │   ├── app/          # Next.js routes & layout
│   │   ├── components/   # shadcn/ui primitives & Task feature components
│   │   ├── hooks/        # useTasks & useToast state management hooks
│   │   ├── schemas/      # Endpoint-wise validation schemas
│   │   ├── services/     # API client service (/api/v1/tasks)
│   │   └── types/        # TypeScript domain contracts
├── docker-compose.yml    # PostgreSQL container setup
└── README.md
```

---

## 🛠 Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v20.x` or `v22.x` (or later)
- **Package Manager**: `npm` (v10+)
- **Docker & Docker Compose**: (Optional, for running local PostgreSQL container)

---

## 🚀 Getting Started from Fresh Clone

### 1. Database Setup (PostgreSQL)

You can spin up PostgreSQL in seconds using the included Docker Compose configuration:

```bash
# In project root directory:
docker compose up -d
```

This starts a PostgreSQL instance on port `5432` with database `taskflow_db`.

---

### 2. Backend Setup (`/api`)

1. **Navigate to the api folder and install dependencies**:
   ```bash
   cd api
   npm install
   ```

2. **Configure Environment Variables**:
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   Default values in `.env`:
   ```env
   NODE_ENV=development
   PORT=3001
   CORS_ORIGIN=http://localhost:3000
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/taskflow_db?schema=public"
   ```

3. **Generate Prisma Client & Run Migrations**:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate:dev -- --name init_tasks
   ```

4. **Start the Backend**:
   ```bash
   npm run start:dev
   ```
   The backend API will run at `http://localhost:3001/api/v1`.

---

### 3. Frontend Setup (`/web`)

1. **Open a new terminal, navigate to the web folder and install dependencies**:
   ```bash
   cd web
   npm install
   ```

2. **Configure Environment Variables**:
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   Default in `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

3. **Start the Frontend**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ✨ Features Implemented

### Backend (`NestJS` + `Prisma 7` + `PostgreSQL`)
- **REST Endpoints**:
  - `POST   /api/v1/tasks`: Create task with title, optional description, status, due date.
  - `GET    /api/v1/tasks`: List all tasks (with optional status filtering & due date sorting).
  - `GET    /api/v1/tasks/:id`: Retrieve single task by numeric ID.
  - `PATCH  /api/v1/tasks/:id`: Partial update of a task.
  - `DELETE /api/v1/tasks/:id`: Delete task by numeric ID.
- **Architecture**:
  - **Fail-Fast Environment Validation**: Validates `DATABASE_URL`, `PORT`, and environment variables upon bootstrap with `class-validator`.
  - **Bootstrap Separation**: `server.ts` (app factory, CORS, pipes, filters) and `main.ts` (process runner).
  - **Repository Pattern**: `TasksRepository` encapsulates direct database persistence queries; `TasksService` handles pure business logic.
  - **Prisma 7 Integration**: Database URL managed in `prisma.config.ts`, PostgreSQL driver adapter (`@prisma/adapter-pg`) with connection pooling.
  - **Standardized Response Envelopes**:
    - Success: `{ success: true, message: string, data: T, timestamp: string }`
    - Error: `{ success: false, error: { code: string, details: [{ field, message }] }, timestamp: string }`

### Frontend (`Next.js` + `shadcn/ui` + `Tailwind CSS`)
- **Task Table**: Tabular view of all tasks with ID, title, description, status badge, due date, and action buttons.
- **Status Badges**: Color-coded badges for `TODO` (slate), `IN_PROGRESS` (amber), and `DONE` (emerald).
- **Create & Edit Dialog**: Unified modal dialog with form validation for creating and editing tasks.
- **Delete Confirmation Alert Dialog**: Prevents accidental deletion by requiring confirmation.
- **Interactive Feedback**: Non-blocking toast notifications on success and error banner with retry option.
- **Bonus Features**:
  - **Status Filter**: Filter tasks by `ALL`, `TODO`, `IN_PROGRESS`, `DONE`.
  - **Due Date Sorting**: Toggle sorting ascending (Earliest First) vs descending (Latest First).

---

## 🤖 How I Used AI

During this project, AI was leveraged as an intelligent pair-programming assistant to accelerate architectural drafting, streamline boilerplate code, and ensure strict alignment with enterprise best practices:

1. **Architecture & Project Planning**:
   - Used AI to plan and refine the multi-tier backend architecture (separating `server.ts` and `main.ts`, isolating Prisma migrations/generated code, and implementing the Repository pattern).
   - Designed endpoint-wise schemas and composable custom React hooks (`useTasks`, `useToast`).

2. **Code Generation & Modifications**:
   - Generated initial boilerplate for DTOs and shadcn/ui component wrappers.
   - Refactored method names across Controller, Service, and Repository layers to reflect strict domain-driven naming rather than generic CRUD verbs.
   - Upgraded database configuration to the modern Prisma 7 standard with `@prisma/adapter-pg` driver adapters and `prisma.config.ts`.

