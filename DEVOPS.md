# DevOps Infrastructure Documentation

## Overview

This document describes the DevOps infrastructure and automation setup for the Todo application, including CI/CD pipelines, Docker configurations, deployment scripts, and environment management.

## 🚀 Quick Start

### Development Setup

1. **Clone and setup environment:**
   ```bash
   git clone <repository-url>
   cd Todo
   git checkout agent/devops
   
   # Setup development environment
   ./scripts/setup-env.sh dev-setup
   ```

2. **Start development services:**
   ```bash
   # Using Docker Compose
   docker-compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml up -d
   
   # Or run locally
   npm install
   npm run dev
   ```

3. **Access services:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000
   - Database Admin: http://localhost:8080
   - PostgreSQL: localhost:5432
   - Redis: localhost:6379

## 📁 Infrastructure Files

### GitHub Actions Workflows

Located in `.github/workflows/`:

- **`ci.yml`** - Main CI/CD pipeline
  - Runs on push to main and agent branches
  - Installs dependencies, runs tests, builds applications
  - Creates Docker images and pushes to registry
  - Performs security scans

- **`deploy.yml`** - Deployment pipeline
  - Deploys to production environments
  - Supports Vercel, Railway, AWS deployments
  - Includes health checks and rollback capabilities

- **`security.yml`** - Security scanning
  - Dependency vulnerability scanning
  - CodeQL static analysis
  - Docker image security scanning
  - Secret scanning with TruffleHog
  - License compliance checking

### Docker Configuration

Located in `docker/`:

- **`Dockerfile.frontend`** - Frontend production image
  - Multi-stage build with Node.js and Nginx
  - Optimized for production with security best practices
  - Includes health checks

- **`Dockerfile.backend`** - Backend production image
  - Multi-stage build with Node.js
  - Non-root user for security
  - Includes Prisma client generation

- **`docker-compose.yml`** - Main compose file
  - PostgreSQL, Redis, Frontend, Backend services
  - Production and development profiles
  - Health checks and dependency management

- **`docker-compose.dev.yml`** - Development overrides
  - Hot reload for development
  - Development database and debugging ports

- **`nginx.conf`** - Frontend nginx configuration
  - Security headers and gzip compression
  - Client-side routing support
  - Cache optimization

### Scripts

Located in `scripts/`:

- **`build.sh`** - Build automation
  - Builds frontend, backend, and shared packages
  - Runs linting, type checking, and tests
  - Creates distribution packages
  - Supports clean builds and production mode

- **`deploy.sh`** - Deployment automation
  - Supports multiple deployment targets
  - Docker, Vercel, Railway, AWS deployments
  - Health checks and rollback capabilities
  - Notification integrations

- **`backup.sh`** - Backup and restore
  - Database and file backups
  - Docker volume backups
  - S3 upload for remote storage
  - Backup verification and cleanup

- **`setup-env.sh`** - Environment setup
  - Creates environment files
  - Validates configuration
  - Sets up development environment

## 🔧 Environment Configuration

### Environment Files

- **`.env.example`** - Template with all available variables
- **`.env.development`** - Development configuration
- **`.env.staging`** - Staging configuration (create manually)
- **`.env.production`** - Production configuration (create manually)

### Key Environment Variables

#### Application
```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-super-secure-secret-key
CORS_ORIGIN=https://yourdomain.com
```

#### Frontend Build
```bash
VITE_API_URL=https://api.yourdomain.com/api
VITE_WS_URL=wss://api.yourdomain.com
VITE_APP_NAME=Todo App
```

#### Deployment
```bash
VERCEL_TOKEN=your-vercel-token
RAILWAY_TOKEN=your-railway-token
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
```

#### Monitoring
```bash
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```

## 🏗️ CI/CD Pipeline

### Pipeline Stages

1. **Install Dependencies** - Caches and installs npm packages
2. **Lint & Type Check** - ESLint and TypeScript validation
3. **Test** - Unit and integration tests with test database
4. **Build** - Compiles applications and creates artifacts
5. **Security Scan** - Vulnerability and secret scanning
6. **Docker Build** - Creates and pushes container images
7. **Deploy** - Deploys to target environments

### Branch Strategy

- **`main`** - Production deployments, full CI/CD pipeline
- **`agent/*`** - Feature branches, CI without deployment
- **Pull Requests** - Full CI pipeline with security scans

### Secrets Management

Required GitHub Secrets:
```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
RAILWAY_TOKEN
DATABASE_URL
JWT_SECRET
CORS_ORIGIN
FRONTEND_URL
BACKEND_URL
SLACK_WEBHOOK_URL
```

## 🐳 Docker Deployment

### Development
```bash
# Start all services
docker-compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production
```bash
# Build and start production services
docker-compose -f docker/docker-compose.yml up -d --build

# Scale services
docker-compose up -d --scale backend=3

# Update services
docker-compose pull && docker-compose up -d
```

## 📊 Monitoring & Logging

### Health Checks

- **Frontend**: `GET /health` - Returns 200 OK
- **Backend**: `GET /api/health` - Returns JSON with system status
- **Database**: Prisma connection check
- **Redis**: Redis ping command

### Log Aggregation

- **Development**: Console logs with colors
- **Production**: JSON structured logs
- **Docker**: Centralized logging with Fluentbit (optional)

### Error Tracking

- **Sentry** integration for error monitoring
- **Application Insights** for Azure deployments
- **CloudWatch** for AWS deployments

## 🔒 Security

### Security Scanning

1. **npm audit** - Dependency vulnerabilities
2. **CodeQL** - Static code analysis
3. **Trivy** - Docker image scanning
4. **TruffleHog** - Secret detection
5. **License compliance** - OSS license validation

### Security Headers

Nginx configuration includes:
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Content-Security-Policy
- Referrer-Policy

### Container Security

- Non-root users in containers
- Minimal base images (Alpine Linux)
- Regular security updates
- Read-only file systems where possible

## 🚀 Deployment Targets

### Vercel (Frontend)
```bash
# Deploy to staging
./scripts/deploy.sh --target vercel --env staging

# Deploy to production
./scripts/deploy.sh --target vercel --env production
```

### Railway (Backend)
```bash
# Deploy backend
./scripts/deploy.sh --target railway --env production
```

### Docker (Self-hosted)
```bash
# Deploy with Docker
./scripts/deploy.sh --target docker
```

### AWS (Full stack)
```bash
# Deploy to AWS
./scripts/deploy.sh --target aws --env production
```

## 📋 Backup & Recovery

### Automated Backups

```bash
# Full backup
./scripts/backup.sh

# Database only
./scripts/backup.sh backup-db

# Files only  
./scripts/backup.sh backup-files
```

### Backup Schedule

- **Development**: Manual backups
- **Staging**: Daily backups (7 days retention)
- **Production**: Daily backups (30 days retention)

### Recovery

```bash
# List available backups
./scripts/backup.sh list

# Restore database
./scripts/backup.sh restore --backup-file ./backups/db_backup_20231201_120000.sql.gz

# Verify backup integrity
./scripts/backup.sh verify --backup-file ./backups/db_backup_20231201_120000.sql.gz
```

## 🔧 Maintenance

### Regular Tasks

1. **Update dependencies** - Monthly security updates
2. **Clean old backups** - Automated via backup script
3. **Monitor resource usage** - CPU, memory, disk, network
4. **Review security scans** - Address vulnerabilities promptly
5. **Test disaster recovery** - Quarterly backup restore tests

### Performance Optimization

- **Docker image caching** - Multi-stage builds with cache layers
- **CDN optimization** - Static asset delivery
- **Database optimization** - Connection pooling and indexing
- **Bundle optimization** - Code splitting and tree shaking

### Scaling Considerations

- **Horizontal scaling** - Load balancer with multiple backend instances
- **Database scaling** - Read replicas and connection pooling
- **Cache optimization** - Redis clustering
- **CDN integration** - Global edge locations

## 🆘 Troubleshooting

### Common Issues

1. **Build failures** - Check Node.js version and dependencies
2. **Test failures** - Ensure test database is running
3. **Deploy failures** - Verify environment variables and secrets
4. **Health check failures** - Check service logs and database connectivity

### Debug Commands

```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs -f [service-name]

# Execute commands in container
docker-compose exec backend sh

# Check environment variables
docker-compose exec backend env

# Test database connection
docker-compose exec postgres psql -U postgres -d todo_dev -c "SELECT 1"
```

### Getting Help

1. Check application logs
2. Verify environment configuration
3. Test individual components
4. Review GitHub Actions logs
5. Check deployment platform status

## 📈 Future Improvements

### Phase 2 (Integration)
- [ ] Cloud platform deployment (Railway/Vercel/AWS)
- [ ] CDN optimization for frontend
- [ ] Managed database hosting
- [ ] SSL certificate automation
- [ ] Enhanced backup strategy

### Phase 3 (Advanced)
- [ ] Blue-green deployments
- [ ] Performance monitoring (APM)
- [ ] Log aggregation platform
- [ ] Infrastructure as Code (Terraform)
- [ ] Kubernetes deployment

---

## Quick Reference

### Useful Commands

```bash
# Environment setup
./scripts/setup-env.sh create development
./scripts/setup-env.sh dev-setup

# Build application
./scripts/build.sh --clean --production

# Deploy application
./scripts/deploy.sh --target docker

# Backup data
./scripts/backup.sh

# Start development
docker-compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml up -d
```

### Important URLs

- **Frontend**: http://localhost:5173 (dev) / http://localhost:80 (prod)
- **Backend**: http://localhost:3000
- **Database Admin**: http://localhost:8080
- **GitHub Actions**: Repository → Actions tab
- **Container Registry**: ghcr.io/username/todo-app

This infrastructure provides a solid foundation for development, testing, and deployment of the Todo application with modern DevOps practices and security considerations.