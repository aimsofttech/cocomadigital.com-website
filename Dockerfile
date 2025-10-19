# ============================================
# Multi-Environment Docker Build Configuration
# Phase 5 Production Optimization
# ============================================

# ---------- Build Stage ----------
FROM node:20-bullseye AS build

WORKDIR /app

# Set build-time arguments for environment configuration
ARG NODE_ENV=production
ARG REACT_APP_ENV=production
ARG REACT_APP_API_URL=https://api.cocomadigital.com
ARG REACT_APP_DEBUG=false
ARG REACT_APP_LOG_LEVEL=error

# Set environment variables for build
ENV NODE_ENV=${NODE_ENV} \
    REACT_APP_ENV=${REACT_APP_ENV} \
    REACT_APP_API_URL=${REACT_APP_API_URL} \
    REACT_APP_DEBUG=${REACT_APP_DEBUG} \
    REACT_APP_LOG_LEVEL=${REACT_APP_LOG_LEVEL} \
    CI=true

# Copy package files
COPY package*.json ./

# Install dependencies with optimization
# Try npm ci first (faster, more reliable), fallback to npm install
RUN npm ci --omit=dev --no-audit --no-fund 2>/dev/null || \
    npm install --omit=dev --no-audit --no-fund

# Copy application source
COPY . .

# Build optimized production bundle
RUN npm run build:prod

# Verify build output
RUN if [ ! -d "/app/build" ]; then echo "Build failed - no build directory"; exit 1; fi && \
    echo "✅ Build completed successfully" && \
    du -sh /app/build

# ---------- Runtime Stage (Multi-stage for smaller final image) ----------
FROM node:20-bullseye-slim

WORKDIR /app

# Install serve globally for production serving
RUN npm install -g serve --no-audit --no-fund && \
    npm cache clean --force

# Copy built application from build stage
COPY --from=build /app/build ./build

# Create directories for potential logs/data
RUN mkdir -p /app/logs

# Set production environment
ENV NODE_ENV=production \
    REACT_APP_ENV=production \
    PORT=8080 \
    NODE_OPTIONS="--max-old-space-size=512"

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080 || exit 1

# Production startup command
# Use serve to serve the static React build
CMD ["serve", "-s", "build", "-l", "8080", "-n"]

# ============================================
# Docker Build & Run Instructions:
# ============================================
# Build (Production):
#   docker build -t cocoma-digital:latest \
#     --build-arg NODE_ENV=production \
#     --build-arg REACT_APP_ENV=production \
#     --build-arg REACT_APP_API_URL=https://api.cocomadigital.com \
#     --build-arg REACT_APP_DEBUG=false \
#     --build-arg REACT_APP_LOG_LEVEL=error \
#     .
#
# Run (Production):
#   docker run -p 8080:8080 \
#     -e REACT_APP_ENV=production \
#     -e REACT_APP_API_URL=https://api.cocomadigital.com \
#     cocoma-digital:latest
#
# Build (Local/Development - for testing):
#   docker build -t cocoma-digital:local \
#     --build-arg NODE_ENV=development \
#     --build-arg REACT_APP_ENV=local \
#     --build-arg REACT_APP_API_URL=http://localhost:8000 \
#     --build-arg REACT_APP_DEBUG=true \
#     --build-arg REACT_APP_LOG_LEVEL=debug \
#     .
#
# Run (Local/Development):
#   docker run -p 3000:8080 \
#     -e REACT_APP_ENV=local \
#     cocoma-digital:local
# ============================================
