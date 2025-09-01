#!/bin/bash

# Deployment script for the Todo application
# Supports multiple deployment targets: docker, vercel, railway, aws

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
DEPLOYMENT_TARGET="${DEPLOYMENT_TARGET:-docker}"
ENVIRONMENT="${ENVIRONMENT:-production}"
BUILD_DIR="${PROJECT_ROOT}/dist"

# Function to print colored output
log() {
    echo -e "${BLUE}[DEPLOY]${NC} $1"
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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to validate environment variables
validate_environment() {
    log "Validating environment variables..."
    
    local missing_vars=()
    
    case "$DEPLOYMENT_TARGET" in
        vercel)
            [ -z "$VERCEL_TOKEN" ] && missing_vars+=("VERCEL_TOKEN")
            [ -z "$VERCEL_ORG_ID" ] && missing_vars+=("VERCEL_ORG_ID")
            [ -z "$VERCEL_PROJECT_ID" ] && missing_vars+=("VERCEL_PROJECT_ID")
            ;;
        railway)
            [ -z "$RAILWAY_TOKEN" ] && missing_vars+=("RAILWAY_TOKEN")
            ;;
        aws)
            [ -z "$AWS_ACCESS_KEY_ID" ] && missing_vars+=("AWS_ACCESS_KEY_ID")
            [ -z "$AWS_SECRET_ACCESS_KEY" ] && missing_vars+=("AWS_SECRET_ACCESS_KEY")
            [ -z "$AWS_REGION" ] && missing_vars+=("AWS_REGION")
            ;;
        docker)
            # Docker deployment doesn't require special env vars by default
            ;;
    esac
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        error "Missing required environment variables for $DEPLOYMENT_TARGET:"
        printf ' - %s\n' "${missing_vars[@]}"
        exit 1
    fi
    
    success "Environment validation passed"
}

# Function to check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    case "$DEPLOYMENT_TARGET" in
        vercel)
            if ! command_exists vercel; then
                error "Vercel CLI is not installed. Install with: npm install -g vercel"
                exit 1
            fi
            ;;
        railway)
            if ! command_exists railway; then
                error "Railway CLI is not installed. Install with: npm install -g @railway/cli"
                exit 1
            fi
            ;;
        docker)
            if ! command_exists docker; then
                error "Docker is not installed"
                exit 1
            fi
            if ! command_exists docker-compose; then
                error "Docker Compose is not installed"
                exit 1
            fi
            ;;
        aws)
            if ! command_exists aws; then
                error "AWS CLI is not installed"
                exit 1
            fi
            ;;
    esac
    
    success "Prerequisites check passed"
}

# Function to run pre-deployment checks
pre_deployment_checks() {
    log "Running pre-deployment checks..."
    
    # Check if build exists
    if [ ! -d "$BUILD_DIR" ]; then
        warning "Build directory not found. Running build first..."
        "${PROJECT_ROOT}/scripts/build.sh" --production
    fi
    
    # Check if tests pass
    if [ "$SKIP_TESTS" != "true" ]; then
        log "Running tests before deployment..."
        cd "$PROJECT_ROOT"
        npm test || {
            error "Tests failed. Aborting deployment."
            exit 1
        }
    fi
    
    success "Pre-deployment checks passed"
}

# Function to deploy to Docker
deploy_docker() {
    log "Deploying to Docker..."
    
    cd "$PROJECT_ROOT"
    
    # Build Docker images
    log "Building Docker images..."
    docker-compose -f docker/docker-compose.yml build
    
    # Stop existing containers
    log "Stopping existing containers..."
    docker-compose -f docker/docker-compose.yml down || true
    
    # Start new containers
    log "Starting new containers..."
    docker-compose -f docker/docker-compose.yml up -d
    
    # Wait for services to be ready
    log "Waiting for services to be ready..."
    sleep 30
    
    # Health check
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost:80/health >/dev/null 2>&1 && \
           curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
            success "Services are healthy"
            break
        fi
        
        log "Attempt $attempt/$max_attempts: Services not ready yet..."
        sleep 10
        ((attempt++))
    done
    
    if [ $attempt -gt $max_attempts ]; then
        error "Services failed to become healthy"
        docker-compose -f docker/docker-compose.yml logs
        exit 1
    fi
    
    success "Docker deployment completed"
    info "Frontend: http://localhost:80"
    info "Backend: http://localhost:3000"
    info "Adminer: http://localhost:8080 (if running development profile)"
}

# Function to deploy frontend to Vercel
deploy_vercel() {
    log "Deploying frontend to Vercel..."
    
    cd "${PROJECT_ROOT}/packages/frontend"
    
    # Build for Vercel
    log "Building frontend for Vercel..."
    npm run build
    
    # Deploy to Vercel
    local deployment_args=""
    if [ "$ENVIRONMENT" = "production" ]; then
        deployment_args="--prod"
    fi
    
    vercel deploy $deployment_args --token "$VERCEL_TOKEN" \
        --scope "$VERCEL_ORG_ID" || {
        error "Vercel deployment failed"
        exit 1
    }
    
    success "Vercel deployment completed"
}

# Function to deploy backend to Railway
deploy_railway() {
    log "Deploying backend to Railway..."
    
    cd "${PROJECT_ROOT}/packages/backend"
    
    # Login to Railway
    echo "$RAILWAY_TOKEN" | railway login --token
    
    # Deploy to Railway
    railway up || {
        error "Railway deployment failed"
        exit 1
    }
    
    success "Railway deployment completed"
}

# Function to deploy to AWS
deploy_aws() {
    log "Deploying to AWS..."
    
    # This is a simplified AWS deployment
    # In practice, you might use AWS CDK, CloudFormation, or Terraform
    
    # Deploy frontend to S3 + CloudFront
    log "Deploying frontend to S3..."
    aws s3 sync "${BUILD_DIR}/frontend/" "s3://${AWS_S3_BUCKET}/" --delete
    
    if [ -n "$AWS_CLOUDFRONT_DISTRIBUTION_ID" ]; then
        log "Invalidating CloudFront cache..."
        aws cloudfront create-invalidation \
            --distribution-id "$AWS_CLOUDFRONT_DISTRIBUTION_ID" \
            --paths "/*"
    fi
    
    # Deploy backend (this would typically involve more complex AWS services)
    warning "Backend deployment to AWS requires additional configuration"
    
    success "AWS deployment completed"
}

# Function to run post-deployment checks
post_deployment_checks() {
    log "Running post-deployment checks..."
    
    case "$DEPLOYMENT_TARGET" in
        docker)
            # Docker health checks already done in deploy_docker
            ;;
        vercel|railway|aws)
            # Add specific health checks for cloud deployments
            if [ -n "$FRONTEND_URL" ]; then
                log "Checking frontend health..."
                curl -f "$FRONTEND_URL/health" || warning "Frontend health check failed"
            fi
            
            if [ -n "$BACKEND_URL" ]; then
                log "Checking backend health..."
                curl -f "$BACKEND_URL/api/health" || warning "Backend health check failed"
            fi
            ;;
    esac
    
    success "Post-deployment checks completed"
}

# Function to create deployment record
create_deployment_record() {
    log "Creating deployment record..."
    
    local deployment_info=$(cat << EOF
{
  "deployment": {
    "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "target": "$DEPLOYMENT_TARGET",
    "environment": "$ENVIRONMENT",
    "commit": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
    "branch": "$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'unknown')",
    "deployer": "${USER:-unknown}",
    "buildNumber": "${BUILD_NUMBER:-local}"
  }
}
EOF
    )
    
    echo "$deployment_info" > "${PROJECT_ROOT}/deployment-${ENVIRONMENT}-$(date +%Y%m%d-%H%M%S).json"
    
    info "Deployment record created"
}

# Function to send notifications
send_notifications() {
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        log "Sending Slack notification..."
        
        local message="✅ Deployment completed successfully!
        • Target: $DEPLOYMENT_TARGET
        • Environment: $ENVIRONMENT  
        • Commit: $(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')
        • Deployer: ${USER:-unknown}"
        
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"$message\"}" \
            "$SLACK_WEBHOOK_URL" || warning "Failed to send Slack notification"
    fi
    
    if [ -n "$DISCORD_WEBHOOK_URL" ]; then
        log "Sending Discord notification..."
        
        local message="✅ **Deployment Completed**\n**Target:** $DEPLOYMENT_TARGET\n**Environment:** $ENVIRONMENT"
        
        curl -X POST -H 'Content-Type: application/json' \
            --data "{\"content\":\"$message\"}" \
            "$DISCORD_WEBHOOK_URL" || warning "Failed to send Discord notification"
    fi
}

# Function to rollback deployment
rollback_deployment() {
    warning "Rolling back deployment..."
    
    case "$DEPLOYMENT_TARGET" in
        docker)
            log "Rolling back Docker deployment..."
            # Implement Docker rollback logic
            warning "Docker rollback not implemented"
            ;;
        vercel)
            log "Rolling back Vercel deployment..."
            # Vercel rollback would typically involve promoting a previous deployment
            warning "Vercel rollback requires manual intervention"
            ;;
        railway)
            log "Rolling back Railway deployment..."
            # Railway rollback
            warning "Railway rollback requires manual intervention"
            ;;
        aws)
            log "Rolling back AWS deployment..."
            # AWS rollback would depend on the specific services used
            warning "AWS rollback requires manual intervention"
            ;;
    esac
}

# Function to show usage
show_usage() {
    cat << EOF
Deployment script for Todo application

Usage: $0 [OPTIONS]

Options:
    --target TARGET     Deployment target (docker|vercel|railway|aws)
    --env ENVIRONMENT   Deployment environment (staging|production)
    --skip-tests        Skip running tests before deployment
    --skip-checks       Skip pre-deployment checks
    --dry-run          Show what would be deployed without actually deploying
    --rollback         Rollback the last deployment
    --help             Show this help message

Environment Variables:
    DEPLOYMENT_TARGET   Default deployment target
    ENVIRONMENT        Default environment
    SKIP_TESTS         Skip tests if set to 'true'
    
    # Vercel
    VERCEL_TOKEN       Vercel authentication token
    VERCEL_ORG_ID      Vercel organization ID
    VERCEL_PROJECT_ID  Vercel project ID
    
    # Railway  
    RAILWAY_TOKEN      Railway authentication token
    
    # AWS
    AWS_ACCESS_KEY_ID       AWS access key
    AWS_SECRET_ACCESS_KEY   AWS secret key
    AWS_REGION             AWS region
    AWS_S3_BUCKET          S3 bucket for frontend
    AWS_CLOUDFRONT_DISTRIBUTION_ID  CloudFront distribution
    
    # Notifications
    SLACK_WEBHOOK_URL      Slack webhook for notifications
    DISCORD_WEBHOOK_URL    Discord webhook for notifications

Examples:
    $0                           # Deploy to default target
    $0 --target docker           # Deploy to Docker
    $0 --target vercel --env staging  # Deploy to Vercel staging
    $0 --rollback                # Rollback last deployment

EOF
}

# Main deployment function
main() {
    local start_time=$(date +%s)
    local rollback=false
    local dry_run=false
    local skip_checks=false
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --target)
                DEPLOYMENT_TARGET="$2"
                shift 2
                ;;
            --env)
                ENVIRONMENT="$2"
                shift 2
                ;;
            --skip-tests)
                SKIP_TESTS=true
                shift
                ;;
            --skip-checks)
                skip_checks=true
                shift
                ;;
            --dry-run)
                dry_run=true
                shift
                ;;
            --rollback)
                rollback=true
                shift
                ;;
            --help)
                show_usage
                exit 0
                ;;
            *)
                error "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
    
    log "Starting deployment process..."
    log "Target: $DEPLOYMENT_TARGET"
    log "Environment: $ENVIRONMENT"
    log "Project root: $PROJECT_ROOT"
    
    if [ "$rollback" = "true" ]; then
        rollback_deployment
        exit 0
    fi
    
    if [ "$dry_run" = "true" ]; then
        log "DRY RUN MODE - No actual deployment will occur"
        log "Would deploy to: $DEPLOYMENT_TARGET"
        log "Environment: $ENVIRONMENT"
        exit 0
    fi
    
    # Validate inputs
    case "$DEPLOYMENT_TARGET" in
        docker|vercel|railway|aws)
            ;;
        *)
            error "Invalid deployment target: $DEPLOYMENT_TARGET"
            error "Valid targets: docker, vercel, railway, aws"
            exit 1
            ;;
    esac
    
    case "$ENVIRONMENT" in
        staging|production)
            ;;
        *)
            error "Invalid environment: $ENVIRONMENT"
            error "Valid environments: staging, production"
            exit 1
            ;;
    esac
    
    # Run deployment steps
    validate_environment
    check_prerequisites
    
    if [ "$skip_checks" != "true" ]; then
        pre_deployment_checks
    fi
    
    # Deploy based on target
    case "$DEPLOYMENT_TARGET" in
        docker)
            deploy_docker
            ;;
        vercel)
            deploy_vercel
            ;;
        railway)
            deploy_railway
            ;;
        aws)
            deploy_aws
            ;;
    esac
    
    post_deployment_checks
    create_deployment_record
    send_notifications
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    success "Deployment completed successfully in ${duration} seconds"
    success "Target: $DEPLOYMENT_TARGET"
    success "Environment: $ENVIRONMENT"
}

# Handle script interruption
trap 'error "Deployment interrupted"; rollback_deployment; exit 1' INT TERM

# Run main function with all arguments
main "$@"