# ---------- Build stage (diagnostic) ----------
FROM node:20-bullseye AS build
WORKDIR /app

COPY package*.json ./

# Install EVERYTHING to rule out missing devDeps
RUN npm install --no-audit --no-fund

COPY . .

# Helpful: show Node & npm versions
RUN node -v && npm -v

# In CRA, CI=true isn't needed; set false to avoid treating some warnings strictly
ENV CI=false

# Verbose build to see the exact missing file/dep
# Also dump the last npm log on failure
RUN npm run build --loglevel verbose || (echo '--- BUILD FAILED, dumping npm logs ---' \
    && (ls -1 /root/.npm/_logs/ || true) \
    && (tail -n +1 /root/.npm/_logs/* 2>/dev/null || true) \
    && exit 1)

# ---------- Runtime ----------
FROM node:20-bullseye-slim
WORKDIR /app
RUN npm i -g serve
COPY --from=build /app/build ./build
ENV PORT=8080
EXPOSE 8080
CMD ["serve","-s","build","-l","8080"]
