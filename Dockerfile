# ---------- Build stage (Debian for better native build support) ----------
FROM node:20-bullseye AS build
WORKDIR /app

# Speed up: copy manifests first to cache deps
COPY package*.json ./

# Install only prod deps (dev deps not needed for CRA build)
# If you DON'T have package-lock.json, switch to: RUN npm install --omit=dev --no-audit --no-fund
RUN npm ci --omit=dev --no-audit --no-fund

# Copy source and build
COPY . .
# CRA builds more reliably with CI=true in CI environments
ENV CI=true
RUN npm run build

# ---------- Runtime stage ----------
FROM node:20-bullseye-slim
WORKDIR /app
RUN npm i -g serve
COPY --from=build /app/build ./build
ENV PORT=8080
EXPOSE 8080
CMD ["serve","-s","build","-l","8080"]
