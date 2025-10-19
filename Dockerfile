# ---------- Build stage ----------
FROM node:20-bullseye AS build
WORKDIR /app

# Build-time vars
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

# 1) Put the production manifest in place
COPY package.production.json ./package.json
COPY package-lock.json* ./

# 2) Install only prod deps
RUN npm ci --omit=dev --no-audit --no-fund || npm install --omit=dev --no-audit --no-fund

# 3) Copy app source WITHOUT overwriting package.json (see .dockerignore below)
COPY . .

# 4) Run the plain CRA build (no cross-env)
RUN npm run build

# ---------- Runtime stage ----------
FROM node:20-bullseye-slim
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*
RUN npm i -g serve --no-audit --no-fund && npm cache clean --force
COPY --from=build /app/build ./build
ENV NODE_ENV=production PORT=8080 NODE_OPTIONS="--max-old-space-size=512"
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080 || exit 1
CMD ["serve","-s","build","-l","8080","-n"]
