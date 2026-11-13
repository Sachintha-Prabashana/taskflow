# TaskFlow — Modern Full-Stack Task Manager

A production-grade, full-stack Task Management application featuring a modular **NestJS** backend with **Prisma 7 & PostgreSQL**, and a reactive **Next.js 16** frontend powered by **TanStack Query v5**, **shadcn/ui**, and **Zod** validation.

---

## 📁 Repository Structure

```
.
├── api/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── common/
│   │   ├── config/
│   │   ├── modules/
│   │   │   └── tasks/
│   │   ├── prisma/
│   │   ├── main.ts
│   │   └── server.ts
│   ├── Dockerfile
│   ├── prisma.config.ts
│   └── README.md
├── web/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   │   ├── providers/
│   │   │   ├── tasks/
│   │   │   └── ui/
│   │   ├── config/
│   │   ├── hooks/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── types/
│   ├── Dockerfile
│   └── README.md
├── .env.example
├── docker-compose.yml
└── README.md
```

---

## 🚀 Quickstart: Option 1 — Docker Compose (Recommended)

Run the entire full-stack ecosystem (PostgreSQL database + NestJS API + Next.js web application) with a single command on any platform (macOS, Linux, Windows, WSL):

```bash
docker-compose up --build
```

### Service Access:
- **Web Dashboard**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api/v1](http://localhost:5000/api/v1)
- **PostgreSQL Database**: `localhost:5432` (Credentials: `postgres:postgres`, DB: `taskflow_db`)

> **Note**: The backend container automatically waits for PostgreSQL to become fully healthy via native healthcheck (`pg_isready`), then applies any pending Prisma database migrations before launching the NestJS server.

---

## 🛠️ Quickstart: Option 2 — Manual Setup (Fresh Clone)

If you prefer to run the applications locally on your host machine without Docker:

### Prerequisites
- **Node.js**: `v24.x` (or `v22+` via NVM)
- **Package Manager**: `npm` (`v10+` / `v11+`)
- **PostgreSQL Database**: Running locally on port `5432` (or via Docker)

---

### Step 1: Database Setup (PostgreSQL)

If you do not have PostgreSQL installed locally, you can start only the database container using Docker Compose:

```bash
docker-compose up -d postgres
```

Or configure any existing PostgreSQL instance and note your connection string:
```
postgresql://postgres:postgres@localhost:5432/taskflow_db?schema=public
```

---

### Step 2: Backend Setup (`/api`)

1. **Navigate to the api folder and install dependencies**:
   ```bash
   cd api
   npm install
   ```

2. **Configure Environment Variables**:
   Copy the example environment configuration:
   ```bash
   cp .env.example .env
   ```
   Verify or edit the `.env` settings:
   ```env
   NODE_ENV=development
   PORT=5000
   CORS_ORIGIN=http://localhost:3000
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskflow_db?schema=public
   ```

3. **Generate Prisma Client & Run Migrations**:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate:dev
   ```

4. **Start the NestJS Development Server**:
   ```bash
   npm run start:dev
   ```
   The backend API will start at: `http://localhost:5000/api/v1`.

---

### Step 3: Frontend Setup (`/web`)

1. **Open a new terminal tab, navigate to the web folder and install dependencies**:
   ```bash
   cd web
   npm install
   ```

2. **Configure Environment Variables**:
   Copy the example environment configuration:
   ```bash
   cp .env.example .env.local
   ```
   Verify `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

3. **Start the Next.js Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at: [http://localhost:3000](http://localhost:3000).

---

## 📋 Assignment Requirements & Bonus Checklist

| Requirement | Status | Implementation Details |
|---|---|---|
| **REST API for Task Resource** | ✅ Completed | Single Task entity with `id`, `title`, `description`, `status`, `dueDate`, `createdAt`, `updatedAt` |
| **Required Endpoints** | ✅ Completed | `GET /tasks`, `GET /tasks/:id`, `POST /tasks`, `PATCH /tasks/:id`, `DELETE /tasks/:id` at global prefix `/api/v1` |
| **Input Validation & Errors** | ✅ Completed | DTOs + `class-validator`, returning `400 Bad Request` with field details and `404 Not Found` for non-existent tasks |
| **Data Persistence** | ✅ Completed | Production-ready **PostgreSQL** with **Prisma 7** runtime adapter architecture |
| **Next.js App Router** | ✅ Completed | Modern Next.js 16 App Router structure in `web/src/app` |
| **shadcn/ui Components** | ✅ Completed | Button, Input, Textarea, Select, Badge, Dialog, AlertDialog, Table, Toast |
| **Task Table & Badges** | ✅ Completed | Responsive table displaying title, description, due date, actions, and status badges (`TODO`, `IN_PROGRESS`, `DONE`) |
| **Create & Edit Dialog** | ✅ Completed | Unified modal dialog with instant client-side Zod validation |
| **Delete Confirmation** | ✅ Completed | Accessible `AlertDialog` asking for user confirmation prior to deletion |
| **Feedback & State Handling** | ✅ Completed | Loading skeleton states, error banners, and floating toast notifications |
| **Bonus 1: Filter by Status** | ✅ Completed | Filter dropdown allowing instant filtering by `ALL`, `TODO`, `IN_PROGRESS`, `DONE` |
| **Bonus 2: Sort by Due Date** | ✅ Completed | Interactive toggle button switching between Ascending (Earliest) and Descending (Latest) |
| **Bonus 3: Full Docker Setup** | ✅ Completed | Multi-stage Dockerfiles with healthchecks, non-root users, Next.js standalone build, and Docker Compose |

---

## 📡 REST API Reference

All endpoints are prefixed with `/api/v1`.

| Method | Endpoint | Description | Request Body | Success Response |
|---|---|---|---|---|
| `GET` | `/api/v1/tasks` | List all tasks (filterable & sortable) | Query: `?status=...&sortBy=...&order=...` | `200 OK` (Array of Tasks) |
| `GET` | `/api/v1/tasks/:id` | Get single task by ID | None | `200 OK` (Single Task) |
| `POST` | `/api/v1/tasks` | Create a new task | `{ title, description?, status?, dueDate? }` | `201 Created` (Created Task) |
| `PATCH` | `/api/v1/tasks/:id` | Update an existing task | `{ title?, description?, status?, dueDate? }` | `200 OK` (Updated Task) |
| `DELETE` | `/api/v1/tasks/:id` | Delete a task by ID | None | `200 OK` (`{ id }`) |

### Standardized Response Contracts

**Success Envelope (`200 OK`, `201 Created`):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": 1,
    "title": "Complete code review",
    "description": "Review PRs for release v1.0",
    "status": "TODO",
    "dueDate": "2026-11-20T18:00:00.000Z",
    "createdAt": "2026-11-13T06:00:00.000Z",
    "updatedAt": "2026-11-13T06:00:00.000Z"
  },
  "timestamp": "2026-11-13T06:00:00.123Z"
}
```

**Error Envelope (`400 Bad Request`, `404 Not Found`, `500 Internal Server Error`):**
```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "details": [
      {
        "field": "title",
        "message": "title is required and cannot be empty"
      }
    ]
  },
  "timestamp": "2026-11-13T06:00:00.123Z"
}
```

---

## 🧠 How I Used AI

In developing this application, **Google Gemini** was used as a lightweight assistant primarily for drafting initial frontend UI component boilerplate and rapid prototyping. The backend architecture, data model, business logic, and repository layer were designed and implemented manually following industry best practices.

### Tools Used
- **Google Gemini**: Used for drafting initial React component scaffolding, Tailwind CSS classes, and icon selection.

### What I Changed in the Generated Code
1. **Migrated from Imperative Fetching to TanStack Query (React Query v5)**:
   - The AI initially generated basic `useEffect` hooks with manual `useState` and imperative fetch calls, which were prone to race conditions and lacked caching.
   - I replaced this with a declarative TanStack Query architecture featuring query keys (`['tasks', filters]`), automated cache invalidation upon mutations (`create`, `update`, `delete`), and request deduplication.
2. **Eliminated Cascading Renders for React 19**:
   - The generated portal dialogs used synchronous `setMounted(true)` inside `useEffect`, causing cascading re-renders and React 19 compiler warnings.
   - I refactored the portal mounting logic to use React's idiomatic `useSyncExternalStore` hook, ensuring zero cascading renders and clean hydration.
3. **Implemented Type-Safe Schema Validation with Zod**:
   - The initial code relied on loose form inputs without robust schema validation.
   - I integrated Zod to build endpoint-wise validation schemas (`create-task.schema.ts`, `update-task.schema.ts`, `query-task.schema.ts`) and derived TypeScript types directly using `z.infer<...>`.
4. **Production Dockerization & Standalone Optimization**:
   - Enhanced the Docker configuration to use Next.js `standalone` mode (reducing image footprint from ~1GB to ~80MB) and added database healthchecks (`pg_isready`) so the API container waits for PostgreSQL to be healthy before executing migrations.
