# =========================================================================
# Multi-stage Dockerfile for DEBRIQ Engineering Platform
# =========================================================================

# --- Stage 1: Build Stage ---
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency specifications
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code and configuration files
COPY tsconfig.json vite.config.ts index.html ./
COPY src/ ./src/
COPY public/ ./public/
COPY server/ ./server/
COPY server.ts ./

# Build client SPA (Vite) and server bundle (esbuild) into dist/
RUN npm run build

# Prune devDependencies to keep image lightweight
RUN npm prune --omit=dev


# --- Stage 2: Production Runtime ---
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV APP_ROOT=/app
ENV DATA_DIR=/app/data
ENV UPLOAD_DIR=/app/uploads

# Create directories for persistent storage and configure permissions
RUN mkdir -p /app/data /app/uploads && chown -R node:node /app

# Copy runtime node_modules and built dist folder from builder
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/dist ./dist

# Run as non-root user for security
USER node

# Expose server port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/api/health || exit 1

# Start the application
CMD ["node", "dist/server.cjs"]
