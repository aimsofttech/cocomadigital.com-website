# ---------- Build stage ----------
FROM node:20-bullseye AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund

COPY . .
ENV CI=true
RUN npm run build

# ---------- Runtime stage ----------
FROM node:20-bullseye-slim
WORKDIR /app
RUN npm i -g serve
COPY --from=build /app/build ./build
ENV PORT=8080
EXPOSE 8080
CMD ["serve", "-s", "build", "-l", "8080"]
