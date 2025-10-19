# ---------- Build stage ----------
FROM node:20-bullseye AS build
WORKDIR /app

# Build-time variables (CRA reads REACT_APP_* during build)
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

# Use the production manifest only
COPY package.production.json ./package.json
COPY package-lock.json* ./

# Install ONLY production deps; fall back to install if no exact lock match
RUN npm ci --omit=dev --no-audit --no-fund || npm install --omit=dev --no-audit --no-fund

# Copy app source and build (IMPORTANT: run the plain build, not build:prod)
COPY . .
RUN npm run build

# ---------- Runtime stage ----------
FROM node:20-bullseye-slim
WORKDIR /app

# Healthcheck needs curl
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Static file server
RUN npm i -g serve --no-audit --no-fund && npm cache clean --force

# Copy built assets only
COPY --from=build /app/build ./build

ENV NODE_ENV=production \
    PORT=8080 \
    NODE_OPTIONS="--max-old-space-size=512"

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080 || exit 1

CMD ["serve", "-s", "build", "-l", "8080", "-n"]
