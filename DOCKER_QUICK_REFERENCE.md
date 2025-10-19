# 🐳 Docker Quick Reference

**Status:** ✅ Production Ready | **Date:** October 19, 2025

---

## ⚡ One-Minute Quick Start

```bash
# Start everything
docker-compose up -d

# Visit the site
curl http://localhost:8080

# View logs
docker-compose logs -f

# Stop everything
docker-compose down
```

---

## 📦 Docker Build & Run

### Quick Build

```bash
docker build -t cocoma-digital:latest .
```

### Quick Run

```bash
docker run -d -p 8080:8080 cocoma-digital:latest
```

### Docker Compose

```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# Rebuild
docker-compose up -d --build

# Logs
docker-compose logs -f cocoma-website
```

---

## 🎯 Common Commands

| Task        | Command                                    |
| ----------- | ------------------------------------------ |
| **Start**   | `docker-compose up -d`                     |
| **Stop**    | `docker-compose down`                      |
| **Rebuild** | `docker-compose up -d --build`             |
| **Logs**    | `docker-compose logs -f cocoma-website`    |
| **Status**  | `docker-compose ps`                        |
| **Shell**   | `docker exec -it cocoma-website /bin/bash` |
| **Stats**   | `docker stats`                             |
| **Health**  | `docker ps \| grep cocoma`                 |

---

## 🌍 Environment Variables

### Production (Default)

```
REACT_APP_ENV=production
REACT_APP_API_URL=https://api.cocomadigital.com
NODE_ENV=production
```

### Development (Testing)

```
REACT_APP_ENV=local
REACT_APP_API_URL=http://localhost:8000
REACT_APP_DEBUG=true
NODE_ENV=development
```

---

## 🔧 Build with Custom Config

```bash
docker build -t cocoma-digital:latest \
  --build-arg REACT_APP_ENV=production \
  --build-arg REACT_APP_API_URL=https://api.production.com \
  .
```

---

## 📊 Image Info

| Aspect      | Value                 |
| ----------- | --------------------- |
| Base Image  | node:20-bullseye-slim |
| Build Image | node:20-bullseye      |
| Bundle Size | 162 KB (gzipped)      |
| Final Size  | 600-800 MB            |
| Build Time  | 2-3 minutes           |
| Startup     | <5 seconds            |

---

## ✅ Verification

```bash
# Check if running
docker ps

# Check health
curl http://localhost:8080

# View logs
docker logs -f cocoma-website

# Check stats
docker stats cocoma-website
```

---

## 🐛 Quick Troubleshooting

| Problem         | Solution                     |
| --------------- | ---------------------------- |
| Build fails     | `docker build --no-cache .`  |
| Port in use     | `docker stop container-name` |
| API not working | Check `REACT_APP_API_URL`    |
| High memory     | Check `docker stats`         |
| Can't access    | Verify port `8080` is open   |

---

## 📁 Key Files

| File                 | Purpose                  |
| -------------------- | ------------------------ |
| `Dockerfile`         | Build configuration      |
| `docker-compose.yml` | Orchestration            |
| `.dockerignore`      | Optimize build context   |
| `.env.docker`        | Default environment vars |

---

## 🚀 Production Deployment

```bash
# Build
docker build -t cocoma-digital:v1.0 .

# Push
docker tag cocoma-digital:v1.0 registry/cocoma-digital:v1.0
docker push registry/cocoma-digital:v1.0

# Run
docker-compose up -d
```

---

## 📞 Need Help?

- **Full Guide:** See `DOCKER_DEPLOYMENT_GUIDE.md`
- **Environment:** See `.env.docker`
- **Compose Config:** See `docker-compose.yml`
- **Build Config:** See `Dockerfile`

---

**Start Now:** `docker-compose up -d`
