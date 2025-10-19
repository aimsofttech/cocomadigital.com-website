# ============================================
# Production Dockerfile for React (Cloud Run)
# Uses package.production.json for dependency control
# ============================================

# ---------- Build Stage ----------
FROM node:20-bullseye AS build
WORKDIR /app

# Environment setup (adjust API URL or variables as needed)
ARG NODE_ENV=production
ARG REACT_APP_ENV=production
ARG REACT_APP_API_URL=https://api.cocomadigital.com
ARG REACT_APP_DEBUG=false
ARG REACT_APP_LOG_LEVEL=error

ENV NODE_ENV=${NODE_ENV} \
    REACT_APP_ENV=${REACT_APP_ENV} \
    REACT_APP_API_URL=${REACT_APP_API_URL} \
    REACT_APP_DEBUG=${REACT_APP_DEBUG} \
    REACT_APP_LOG_LEVEL=${REACT_APP_LOG_LEVEL} \
    CI=true

# ---------------------------------------------------------
# Use production package.json explicitly
# ---------------------------------------------------------
COPY package.production.json ./package.json
COPY package-lock.json* ./

# Install only production dependencies
RUN npm ci --omit=dev --no-audit --no-fund || npm install --omit=dev --no-audit --no-fund

# Copy application source code
COPY . .

# Build optimized production bundle
RUN npm run build || (echo '❌ Build failed' && exit 1)

# ---------- Runtime Stage ----------
FROM node:20-bullseye-slim
WORKDIR /app

# Install minimal packages for serving and healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/* \
    && npm i -g serve --no-audit --no-fund \
    && npm cache clean --force

# Copy built app from previous stage
COPY --from=build /app/build ./build

# Setup environment for runtime
ENV NODE_ENV=production \
    PORT=8080 \
    NODE_OPTIONS="--max-old-space-size=512"

EXPOSE 8080

# Healthcheck for Cloud Run
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080 || exit 1

# Start static file server
CMD ["serve", "-s", "build", "-l", "8080", "-n"]

# ============================================
# Notes:
# - This image only installs production deps.
# - Cloud Run reads PORT automatically.
# ============================================
