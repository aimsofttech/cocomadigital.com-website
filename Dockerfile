# --- Build stage ---
FROM node:20-bullseye AS build
WORKDIR /app

# ... your ARG/ENV for REACT_APP_* (keep these) ...

# IMPORTANT: do NOT force CI=true for CRA builds
# Remove CI=true from earlier, and set to false to avoid "warnings as errors"
ENV CI=false

COPY package.production.json ./package.json
COPY package-lock.json* ./
RUN npm ci --omit=dev --no-audit --no-fund || npm install --omit=dev --no-audit --no-fund

COPY . .
RUN npm run build
