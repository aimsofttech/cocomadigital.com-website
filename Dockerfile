# ---------- Build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install --no-audit --no-fund

# Copy source and build
COPY . .
# Your package.json already has a high-memory CRA build, so this is fine:
RUN npm run build

# ---------- Runtime stage ----------
FROM node:20-alpine
WORKDIR /app

# Serve static files
RUN npm i -g serve

# Copy the built assets
COPY --from=build /app/build ./build

# Cloud Run listens on $PORT; we'll forward it
ENV PORT=8080
EXPOSE 8080

CMD ["serve","-s","build","-l","8080"]
