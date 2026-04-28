# syntax=docker/dockerfile:1

# ── deps ───────────────────────────────────────────────────────────────────────
FROM node:lts-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# ── builder ────────────────────────────────────────────────────────────────────
FROM node:lts-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json tsup.config.ts ./
COPY src ./src
RUN npm run build

# ── runtime ────────────────────────────────────────────────────────────────────
FROM node:lts-alpine AS runtime
ENV NODE_ENV=production
RUN addgroup --system app && adduser --system --ingroup app app
WORKDIR /app
COPY --from=deps    /app/node_modules ./node_modules
COPY --from=builder /app/dist         ./dist
USER app
EXPOSE 3000
CMD ["node", "dist/server.js"]
