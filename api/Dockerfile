# Stage 1: Build & Dependencies
FROM node:24-alpine AS builder

WORKDIR /app

# Install OpenSSL for Prisma engine compatibility on Alpine
RUN apk add --no-cache openssl

# Install dependencies
COPY package*.json prisma.config.ts ./
COPY prisma ./prisma
RUN npm ci

# Generate Prisma Client (build-time placeholder for schema generation)
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/taskflow_db"
RUN npx prisma generate

# Build application
COPY tsconfig*.json ./
COPY src ./src
RUN npm run build

# Prune development dependencies
RUN npm prune --omit=dev

# Stage 2: Production Runner
FROM node:24-alpine AS runner

WORKDIR /app

# Install OpenSSL for Prisma runtime on Alpine
RUN apk add --no-cache openssl

ENV NODE_ENV=production
ENV PORT=5000

# Security: Create non-root system user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Copy runtime artifacts from builder
COPY --chown=nestjs:nodejs --from=builder /app/package.json ./package.json
COPY --chown=nestjs:nodejs --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --chown=nestjs:nodejs --from=builder /app/node_modules ./node_modules
COPY --chown=nestjs:nodejs --from=builder /app/dist ./dist
COPY --chown=nestjs:nodejs --from=builder /app/prisma ./prisma

USER nestjs

EXPOSE 5000

# Run pending database migrations before starting the NestJS application
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]

