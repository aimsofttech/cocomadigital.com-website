# ---------- Runtime stage ----------
FROM node:20-bullseye-slim
WORKDIR /app

# Tools for healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Static file server
RUN npm i -g serve --no-audit --no-fund && npm cache clean --force

# Copy built assets
COPY --from=build /app/build ./build

# Cloud Run provides PORT; default to 8080 if missing (local runs)
ENV PORT=8080 NODE_ENV=production

EXPOSE 8080

# IMPORTANT: bind to 0.0.0.0 and respect $PORT
CMD ["sh","-c","test -d build || { echo 'build/ missing'; exit 1; } && serve -s build -l tcp://0.0.0.0:${PORT:-8080} -n"]

# Optional healthcheck (now that curl is present)
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -fsS http://127.0.0.1:${PORT:-8080}/ || exit 1
