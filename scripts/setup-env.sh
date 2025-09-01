#!/bin/bash

# Environment setup script for the Todo application
# Helps set up environment files for different environments

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Function to print colored output
log() {
    echo -e "${BLUE}[SETUP]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

info() {
    echo -e "${PURPLE}[INFO]${NC} $1"
}

# Function to generate random secret
generate_secret() {
    local length=${1:-32}
    openssl rand -base64 $length | tr -d "=+/" | cut -c1-$length
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to create environment file
create_env_file() {
    local env_name="$1"
    local env_file="${PROJECT_ROOT}/.env.${env_name}"
    
    log "Creating environment file: .env.${env_name}"
    
    case "$env_name" in
        development)
            create_development_env "$env_file"
            ;;
        staging)
            create_staging_env "$env_file"
            ;;
        production)
            create_production_env "$env_file"
            ;;
        *)
            error "Unknown environment: $env_name"
            exit 1
            ;;
    esac
    
    success "Created .env.${env_name}"
}

# Function to create development environment
create_development_env() {
    local env_file="$1"
    
    cat > "$env_file" << EOF
# Development Environment Configuration
NODE_ENV=development
PORT=3000
FRONTEND_PORT=5173

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/todo_dev
DB_HOST=localhost
DB_PORT=5432
DB_NAME=todo_dev
DB_USER=postgres
DB_PASSWORD=postgres

# Redis
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=dev-secret-key-not-for-production-use-only
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# Logging
LOG_LEVEL=debug
LOG_FORMAT=dev
LOG_FILE_PATH=./logs/app-dev.log

# Frontend
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000
VITE_APP_NAME=Todo App (Dev)
VITE_APP_VERSION=1.0.0-dev
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_PWA=false
VITE_ENABLE_NOTIFICATIONS=false

# Development settings
SKIP_TESTS=false
SKIP_LINT=false
DEBUG=app:*
CHOKIDAR_USEPOLLING=false
FAST_REFRESH=true

# Docker Compose
POSTGRES_DB=todo_dev
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_PORT=5432
REDIS_PORT=6379
ADMINER_PORT=8080
BACKEND_PORT=3000
EOF
}

# Function to create staging environment
create_staging_env() {
    local env_file="$1"
    local jwt_secret=$(generate_secret 32)
    local db_password=$(generate_secret 16)
    
    cat > "$env_file" << EOF
# Staging Environment Configuration
NODE_ENV=staging
PORT=3000

# Database (Update with your staging database URL)
DATABASE_URL=postgresql://todo_user:${db_password}@staging-db:5432/todo_staging
DB_HOST=staging-db
DB_PORT=5432
DB_NAME=todo_staging
DB_USER=todo_user
DB_PASSWORD=${db_password}

# Redis (Update with your staging Redis URL)
REDIS_URL=redis://staging-redis:6379

# JWT
JWT_SECRET=${jwt_secret}
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# CORS (Update with your staging domain)
CORS_ORIGIN=https://staging.yourdomain.com

# Logging
LOG_LEVEL=info
LOG_FORMAT=combined
LOG_FILE_PATH=./logs/app-staging.log

# Frontend (Update with your staging URLs)
VITE_API_URL=https://staging-api.yourdomain.com/api
VITE_WS_URL=wss://staging-api.yourdomain.com
VITE_APP_NAME=Todo App (Staging)
VITE_APP_VERSION=1.0.0-staging
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_PWA=true
VITE_ENABLE_NOTIFICATIONS=true

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=200

# Monitoring (Add your staging monitoring tokens)
# SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
# GA_TRACKING_ID=GA-XXXXXXXXX-X

# Deployment (Add your deployment tokens)
# VERCEL_TOKEN=your-vercel-token
# RAILWAY_TOKEN=your-railway-token
EOF

    warning "Please update the following in .env.staging:"
    warning "- Database URLs and credentials"
    warning "- Frontend/Backend URLs"
    warning "- Monitoring tokens (Sentry, GA)"
    warning "- Deployment tokens (Vercel, Railway)"
}

# Function to create production environment
create_production_env() {
    local env_file="$1"
    local jwt_secret=$(generate_secret 64)
    
    cat > "$env_file" << EOF
# Production Environment Configuration
NODE_ENV=production
PORT=3000

# Database (UPDATE WITH YOUR PRODUCTION DATABASE)
# DATABASE_URL=postgresql://prod_user:SECURE_PASSWORD@prod-db:5432/todo_prod?sslmode=require
DATABASE_URL=CHANGE_ME_PRODUCTION_DATABASE_URL

# Redis (UPDATE WITH YOUR PRODUCTION REDIS)
# REDIS_URL=rediss://prod_user:SECURE_PASSWORD@prod-redis:6380
REDIS_URL=CHANGE_ME_PRODUCTION_REDIS_URL

# JWT (Generated secure secret)
JWT_SECRET=${jwt_secret}
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# CORS (UPDATE WITH YOUR PRODUCTION DOMAINS)
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

# Logging
LOG_LEVEL=warn
LOG_FORMAT=json
LOG_FILE_PATH=./logs/app-prod.log

# Frontend (UPDATE WITH YOUR PRODUCTION URLs)
VITE_API_URL=https://api.yourdomain.com/api
VITE_WS_URL=wss://api.yourdomain.com
VITE_APP_NAME=Todo App
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_PWA=true
VITE_ENABLE_NOTIFICATIONS=true

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
HELMET_CSP_DIRECTIVES=default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'

# File Uploads
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# Monitoring (ADD YOUR PRODUCTION TOKENS)
# SENTRY_DSN=https://your-production-sentry-dsn@sentry.io/project-id
# SENTRY_ENVIRONMENT=production
# GA_TRACKING_ID=GA-XXXXXXXXX-X

# Email (ADD YOUR EMAIL CONFIGURATION)
# SMTP_HOST=smtp.yourdomain.com
# SMTP_PORT=587
# SMTP_SECURE=true
# SMTP_USER=noreply@yourdomain.com
# SMTP_PASS=YOUR_EMAIL_PASSWORD
# EMAIL_FROM=noreply@yourdomain.com

# Backup Configuration
BACKUP_RETENTION_DAYS=90
# BACKUP_S3_BUCKET=your-production-backup-bucket
# BACKUP_S3_PREFIX=backups/todo/prod

# Deployment Tokens (ADD YOUR TOKENS)
# VERCEL_TOKEN=your-production-vercel-token
# VERCEL_ORG_ID=your-org-id
# VERCEL_PROJECT_ID=your-project-id
# RAILWAY_TOKEN=your-production-railway-token

# AWS Configuration (IF USING AWS)
# AWS_ACCESS_KEY_ID=your-aws-access-key
# AWS_SECRET_ACCESS_KEY=your-aws-secret-key  
# AWS_REGION=us-east-1
# AWS_S3_BUCKET=your-production-s3-bucket

# Notification Webhooks (ADD YOUR WEBHOOKS)
# SLACK_WEBHOOK_URL=https://hooks.slack.com/services/your/production/webhook
# DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/your/production/webhook
EOF

    warning "IMPORTANT: Please update .env.production with your actual production values:"
    warning "- Database and Redis URLs with secure credentials"
    warning "- Production domain names and URLs"
    warning "- Monitoring and analytics tokens"
    warning "- Email SMTP configuration"
    warning "- Backup storage configuration"
    warning "- Deployment tokens and AWS credentials"
    warning "- Notification webhook URLs"
    warning ""
    error "DO NOT use the generated .env.production as-is in production!"
}

# Function to validate environment file
validate_env_file() {
    local env_file="$1"
    
    if [ ! -f "$env_file" ]; then
        error "Environment file not found: $env_file"
        return 1
    fi
    
    log "Validating environment file: $(basename "$env_file")"
    
    local issues=0
    
    # Check for placeholder values
    local placeholders=(
        "CHANGE_ME"
        "your-token"
        "your-secret"
        "yourdomain.com"
        "YOUR_"
    )
    
    for placeholder in "${placeholders[@]}"; do
        if grep -q "$placeholder" "$env_file"; then
            warning "Found placeholder value '$placeholder' in $(basename "$env_file")"
            ((issues++))
        fi
    done
    
    # Check for required variables
    local required_vars=(
        "NODE_ENV"
        "DATABASE_URL"
        "JWT_SECRET"
    )
    
    for var in "${required_vars[@]}"; do
        if ! grep -q "^$var=" "$env_file"; then
            error "Missing required variable '$var' in $(basename "$env_file")"
            ((issues++))
        fi
    done
    
    # Check JWT secret length
    local jwt_secret=$(grep "^JWT_SECRET=" "$env_file" | cut -d'=' -f2)
    if [ ${#jwt_secret} -lt 32 ]; then
        warning "JWT_SECRET should be at least 32 characters long"
        ((issues++))
    fi
    
    if [ $issues -eq 0 ]; then
        success "Environment file validation passed"
        return 0
    else
        warning "Found $issues issue(s) in environment file"
        return 1
    fi
}

# Function to copy example file
copy_example() {
    local target_env="$1"
    local source_file="${PROJECT_ROOT}/.env.example"
    local target_file="${PROJECT_ROOT}/.env.${target_env}"
    
    if [ ! -f "$source_file" ]; then
        error ".env.example file not found"
        exit 1
    fi
    
    if [ -f "$target_file" ]; then
        read -p "File .env.${target_env} already exists. Overwrite? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            info "Skipping .env.${target_env}"
            return 0
        fi
    fi
    
    cp "$source_file" "$target_file"
    success "Copied .env.example to .env.${target_env}"
    warning "Please edit .env.${target_env} with your actual values"
}

# Function to show current environment files
show_env_files() {
    log "Current environment files:"
    
    cd "$PROJECT_ROOT"
    
    if ls .env* >/dev/null 2>&1; then
        for env_file in .env*; do
            if [ -f "$env_file" ]; then
                local size=$(du -sh "$env_file" | cut -f1)
                local modified=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M" "$env_file" 2>/dev/null || stat -c "%y" "$env_file" 2>/dev/null | cut -d' ' -f1,2 | cut -c1-16)
                echo "  $env_file ($size, modified: $modified)"
            fi
        done
    else
        info "No environment files found"
    fi
}

# Function to setup development environment
setup_dev_environment() {
    log "Setting up development environment..."
    
    # Create development env file
    if [ ! -f "${PROJECT_ROOT}/.env.development" ]; then
        create_env_file "development"
    else
        warning ".env.development already exists, skipping"
    fi
    
    # Check if Docker is available
    if command_exists docker && command_exists docker-compose; then
        log "Starting development services with Docker..."
        cd "$PROJECT_ROOT"
        docker-compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml up -d postgres redis
        
        # Wait for services
        log "Waiting for services to start..."
        sleep 10
        
        # Test database connection
        if docker-compose -f docker/docker-compose.yml exec -T postgres pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
            success "PostgreSQL is ready"
        else
            warning "PostgreSQL may not be ready yet"
        fi
        
        # Test Redis connection  
        if docker-compose -f docker/docker-compose.yml exec -T redis redis-cli ping >/dev/null 2>&1; then
            success "Redis is ready"
        else
            warning "Redis may not be ready yet"
        fi
        
        info "Development services are starting up"
        info "PostgreSQL: localhost:5432"
        info "Redis: localhost:6379"
        info "Adminer: http://localhost:8080"
    else
        warning "Docker not available. Please install PostgreSQL and Redis manually."
    fi
}

# Function to show usage
show_usage() {
    cat << EOF
Environment setup script for Todo application

Usage: $0 [COMMAND] [OPTIONS]

Commands:
    create ENV      Create environment file (development|staging|production)
    copy ENV        Copy .env.example to .env.ENV
    validate FILE   Validate environment file
    list            List current environment files
    dev-setup       Setup complete development environment
    help            Show this help message

Examples:
    $0 create development       # Create .env.development
    $0 create production        # Create .env.production  
    $0 copy staging            # Copy .env.example to .env.staging
    $0 validate .env.production # Validate production env file
    $0 list                    # List all env files
    $0 dev-setup              # Setup development environment

EOF
}

# Main function
main() {
    local command="${1:-help}"
    
    case "$command" in
        create)
            if [ -z "$2" ]; then
                error "Environment name required"
                show_usage
                exit 1
            fi
            create_env_file "$2"
            validate_env_file "${PROJECT_ROOT}/.env.$2"
            ;;
        copy)
            if [ -z "$2" ]; then
                error "Environment name required"
                show_usage
                exit 1
            fi
            copy_example "$2"
            ;;
        validate)
            if [ -z "$2" ]; then
                error "Environment file required"
                show_usage
                exit 1
            fi
            validate_env_file "$2"
            ;;
        list)
            show_env_files
            ;;
        dev-setup)
            setup_dev_environment
            ;;
        help|--help|-h)
            show_usage
            ;;
        *)
            error "Unknown command: $command"
            show_usage
            exit 1
            ;;
    esac
}

# Check prerequisites
if ! command_exists openssl; then
    error "OpenSSL is required for generating secrets"
    exit 1
fi

# Run main function
main "$@"