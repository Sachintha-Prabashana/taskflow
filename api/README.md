# TaskFlow Backend API

Production-ready REST API built with **NestJS 12**, **Prisma 7**, and **PostgreSQL**, implementing strict Domain/Repository separation, standardized response envelopes, and fail-fast environment validation.

---

## 🏛️ Architecture & Design Patterns

The backend follows clean layered architecture principles to ensure testability, maintainability, and loose coupling:

```
src/
├── common/                   # Cross-cutting concerns
│   ├── constants/            # Enum definitions & Task status constants
│   ├── decorators/           # Custom decorators (@ResponseMessage)
│   ├── filters/              # Global HttpExceptionFilter (Standardized RFC error envelope)
│   └── interceptors/         # Global TransformInterceptor (Standardized success envelope)
├── config/                   # Fail-fast environment validation via class-validator
├── prisma/                   # PrismaService with PostgreSQL Pool driver adapter
├── modules/                  # Application feature modules
│   └── tasks/                # Tasks Domain Module
│       ├── dto/
│       │   ├── requests/     # CreateTaskDto, UpdateTaskDto, QueryTaskDto
│       │   └── responses/    # TaskResponseDto (exposes clean domain contracts)
│       ├── tasks.controller.ts # Action-oriented HTTP route handlers (/api/v1/tasks)
│       ├── tasks.service.ts  # Domain business logic & 404 entity verification
│       ├── tasks.repository.ts # Query-oriented database access layer via Prisma
│       └── tasks.module.ts   # Module declaration & dependency injection wiring
├── server.ts                 # Application factory (CORS, Pipes, Global Prefix, Interceptors)
└── main.ts                   # Lifecycle runner and bootstrap entrypoint
```

### Layer Responsibilities
1. **Controller Layer (`tasks.controller.ts`)**:
   - Maps HTTP verbs to action-oriented methods (`createTask`, `getTasks`, `getTaskById`, `updateTask`, `deleteTask`).
   - Applies status codes (`201 Created` for POST, `200 OK` for GET/PATCH/DELETE).
   - Enforces DTO validation pipes.
2. **Service Layer (`tasks.service.ts`)**:
   - Contains pure business logic.
   - Verifies resource existence and throws `NotFoundException` when a task does not exist.
   - Maps database entities to `TaskResponseDto` instances.
3. **Repository Layer (`tasks.repository.ts`)**:
   - Contains pure database access queries (`insert`, `findMany`, `findById`, `updateById`, `deleteById`).
   - Shields the service layer from direct ORM implementation details.
4. **Prisma 7 Runtime (`prisma.service.ts` & `prisma.config.ts`)**:
   - Uses `@prisma/adapter-pg` with `pg.Pool` for native connection pooling.
   - Database URL is decoupled from `schema.prisma` and configured centrally via `prisma.config.ts`.

---

## ⚙️ Environment Variables

Copy the example file to `.env`:
```bash
cp .env.example .env
```

| Variable | Type | Default | Description |
|---|---|---|---|
| `NODE_ENV` | `string` | `development` | Application mode (`development`, `production`, `test`) |
| `PORT` | `number` | `5000` | Port on which the HTTP server listens |
| `DATABASE_URL` | `string` | *Required* | PostgreSQL connection string |
| `CORS_ORIGIN` | `string` | `http://localhost:3000` | Allowed origin(s) for CORS. Can be comma-separated |

> **Fail-Fast Validation**: On bootstrap, `src/config/env.validation.ts` validates all environment variables using `class-validator`. If any required variable is missing or malformed, the process exits immediately with a descriptive error.

---

## 📦 Getting Started

### Prerequisites
- **Node.js**: `v24.x` (or `v22+` via NVM)
- **Package Manager**: `npm` (`v10+` / `v11+`)
- **PostgreSQL**: `v16+`

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Migrations
Ensure PostgreSQL is running, then generate the Prisma client and apply migrations:
```bash
# Generate Prisma Client to prisma/generated/client
npm run prisma:generate

# Apply pending database migrations
npm run prisma:migrate:dev
```

### 3. Start Development Server
```bash
npm run start:dev
```
The server will start at: `http://localhost:5000/api/v1`.

---

## 📡 REST API Specification

Global prefix: `/api/v1`

### 1. Create Task
- **Endpoint**: `POST /api/v1/tasks`
- **Status**: `201 Created`
- **Request Body**:
  ```json
  {
    "title": "Design Database Schema",
    "description": "Create PostgreSQL tables using Prisma",
    "status": "IN_PROGRESS",
    "dueDate": "2026-11-25T15:00:00.000Z"
  }
  ```
- **Validation**:
  - `title`: String, required, non-empty.
  - `description`: String, optional.
  - `status`: String, optional, must be `TODO`, `IN_PROGRESS`, or `DONE` (defaults to `TODO`).
  - `dueDate`: ISO date string, optional.

### 2. Get All Tasks
- **Endpoint**: `GET /api/v1/tasks`
- **Status**: `200 OK`
- **Query Parameters**:
  - `status`: Optional (`TODO`, `IN_PROGRESS`, `DONE`).
  - `sortBy`: Optional (`dueDate`, `createdAt`, `title`, `id`. Default: `createdAt`).
  - `order`: Optional (`asc`, `desc`. Default: `desc`).

### 3. Get Single Task by ID
- **Endpoint**: `GET /api/v1/tasks/:id`
- **Status**: `200 OK`
- Returns `404 Not Found` if the task does not exist.

### 4. Update Task
- **Endpoint**: `PATCH /api/v1/tasks/:id`
- **Status**: `200 OK`
- **Request Body**: Partial `CreateTaskDto` fields.
- Returns `404 Not Found` if the task does not exist.

### 5. Delete Task
- **Endpoint**: `DELETE /api/v1/tasks/:id`
- **Status**: `200 OK`
- Returns `404 Not Found` if the task does not exist.

---

## 📜 Available NPM Scripts

| Command | Description |
|---|---|
| `npm run start:dev` | Start the NestJS application in watch mode |
| `npm run build` | Compile the TypeScript application into `/dist` |
| `npm run start:prod` | Run the compiled production application (`node dist/main.js`) |
| `npm run prisma:generate` | Generate the Prisma Client from schema |
| `npm run prisma:migrate:dev` | Apply Prisma migrations in development |
| `npm run prisma:migrate:deploy` | Apply migrations in production environments / Docker |
| `npm run prisma:studio` | Open Prisma Studio GUI in browser to inspect database |
| `npm run lint` | Run code linter |
