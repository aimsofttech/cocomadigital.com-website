# ---------- Build stage ----------
FROM node:20-bullseye AS build
WORKDIR /app

# (env/args as needed)
ARG NODE_ENV=production
ARG REACT_APP_ENV=production
ARG REACT_APP_API_URL=https://api.cocomadigital.com
ENV NODE_ENV=${NODE_ENV} REACT_APP_ENV=${REACT_APP_ENV} REACT_APP_API_URL=${REACT_APP_API_URL} CI=false

# Use prod manifest
COPY package.production.json ./package.json
COPY package-lock.json* ./
RUN npm ci --omit=dev --no-audit --no-fund || npm install --omit=dev --no-audit --no-fund

# App sources (make sure your .dockerignore doesn't exclude src/public)
COPY . .
RUN npm run build

# ---------- Runtime stage ----------
FROM node:20-bullseye-slim
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*
RUN npm i -g serve --no-audit --no-fund && npm cache clean --force

# ✅ Copies from the stage named "build"
COPY --from=build /app/build ./build

ENV PORT=8080 NODE_ENV=production
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -fsS http://127.0.0.1:${PORT:-8080}/ || exit 1

# bind to 0.0.0.0 and respect $PORT
CMD ["sh","-c","test -d build || { echo 'build/ missing'; exit 1; } && serve -s build -l tcp://0.0.0.0:${PORT:-8080} -n"]
