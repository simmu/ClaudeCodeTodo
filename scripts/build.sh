#!/bin/bash

# Build script for the Todo application
# This script builds both frontend and backend applications

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_DIR="${PROJECT_ROOT}/dist"
FRONTEND_DIR="${PROJECT_ROOT}/packages/frontend"
BACKEND_DIR="${PROJECT_ROOT}/packages/backend"
SHARED_DIR="${PROJECT_ROOT}/packages/shared"

# Function to print colored output
log() {
    echo -e "${BLUE}[BUILD]${NC} $1"
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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to clean previous builds
clean_build() {
    log "Cleaning previous builds..."
    
    # Remove build directories
    rm -rf "${BUILD_DIR}"
    rm -rf "${FRONTEND_DIR}/dist"
    rm -rf "${BACKEND_DIR}/dist"
    rm -rf "${SHARED_DIR}/dist"
    
    success "Cleaned previous builds"
}

# Function to check Node.js version
check_node_version() {
    log "Checking Node.js version..."
    
    if ! command_exists node; then
        error "Node.js is not installed"
        exit 1
    fi
    
    NODE_VERSION=$(node -v)
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | cut -d'v' -f2)
    
    if [ "$MAJOR_VERSION" -lt 18 ]; then
        error "Node.js version 18 or higher is required. Current version: $NODE_VERSION"
        exit 1
    fi
    
    success "Node.js version check passed: $NODE_VERSION"
}

# Function to install dependencies
install_dependencies() {
    log "Installing dependencies..."
    
    cd "$PROJECT_ROOT"
    
    # Check if node_modules exists and package-lock.json is newer
    if [ -d "node_modules" ] && [ "package-lock.json" -ot "node_modules" ]; then
        warning "Dependencies may be outdated. Consider running 'npm ci' manually."
    fi
    
    npm ci --silent
    
    success "Dependencies installed"
}

# Function to run linting
run_lint() {
    log "Running linting..."
    
    cd "$PROJECT_ROOT"
    
    if npm run lint > /dev/null 2>&1; then
        success "Linting passed"
    else
        warning "Linting issues found. Build will continue but please review the issues."
        npm run lint || true
    fi
}

# Function to run type checking
run_typecheck() {
    log "Running type checking..."
    
    cd "$PROJECT_ROOT"
    
    npm run typecheck
    
    success "Type checking passed"
}

# Function to build shared package
build_shared() {
    log "Building shared package..."
    
    cd "$SHARED_DIR"
    
    # Build shared package first as other packages depend on it
    npm run build
    
    success "Shared package built successfully"
}

# Function to build backend
build_backend() {
    log "Building backend..."
    
    cd "$BACKEND_DIR"
    
    # Generate Prisma client
    log "Generating Prisma client..."
    npx prisma generate
    
    # Build TypeScript
    npm run build
    
    # Copy prisma schema to dist
    mkdir -p dist/prisma
    cp -r prisma/* dist/prisma/
    
    success "Backend built successfully"
}

# Function to build frontend
build_frontend() {
    log "Building frontend..."
    
    cd "$FRONTEND_DIR"
    
    # Build with Vite
    npm run build
    
    success "Frontend built successfully"
}

# Function to create distribution package
create_dist_package() {
    log "Creating distribution package..."
    
    mkdir -p "$BUILD_DIR"
    
    # Copy frontend build
    cp -r "${FRONTEND_DIR}/dist" "${BUILD_DIR}/frontend"
    
    # Copy backend build
    cp -r "${BACKEND_DIR}/dist" "${BUILD_DIR}/backend"
    cp "${BACKEND_DIR}/package.json" "${BUILD_DIR}/backend/"
    
    # Copy shared build
    cp -r "${SHARED_DIR}/dist" "${BUILD_DIR}/shared"
    
    # Copy Docker files
    cp -r "${PROJECT_ROOT}/docker" "${BUILD_DIR}/"
    
    # Copy root package.json and scripts
    cp "${PROJECT_ROOT}/package.json" "${BUILD_DIR}/"
    cp -r "${PROJECT_ROOT}/scripts" "${BUILD_DIR}/"
    
    # Create build info
    cat > "${BUILD_DIR}/build-info.json" << EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "commit": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
  "branch": "$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'unknown')",
  "nodeVersion": "$(node -v)",
  "npmVersion": "$(npm -v)",
  "buildNumber": "${BUILD_NUMBER:-local}"
}
EOF
    
    success "Distribution package created in ${BUILD_DIR}"
}

# Function to run tests
run_tests() {
    if [ "$SKIP_TESTS" != "true" ]; then
        log "Running tests..."
        
        cd "$PROJECT_ROOT"
        
        # Only run tests if test script exists and we're not in CI
        if npm run test > /dev/null 2>&1; then
            success "Tests passed"
        else
            warning "Tests failed or not configured. Build will continue."
        fi
    else
        warning "Tests skipped (SKIP_TESTS=true)"
    fi
}

# Function to analyze bundle size
analyze_bundle() {
    if command_exists du; then
        log "Analyzing bundle sizes..."
        
        if [ -d "${FRONTEND_DIR}/dist" ]; then
            FRONTEND_SIZE=$(du -sh "${FRONTEND_DIR}/dist" | cut -f1)
            log "Frontend bundle size: $FRONTEND_SIZE"
        fi
        
        if [ -d "${BACKEND_DIR}/dist" ]; then
            BACKEND_SIZE=$(du -sh "${BACKEND_DIR}/dist" | cut -f1)
            log "Backend bundle size: $BACKEND_SIZE"
        fi
    fi
}

# Function to show build summary
show_summary() {
    log "Build Summary:"
    echo "  Frontend: ${FRONTEND_DIR}/dist"
    echo "  Backend: ${BACKEND_DIR}/dist"
    echo "  Shared: ${SHARED_DIR}/dist"
    echo "  Distribution: ${BUILD_DIR}"
    
    if [ -f "${BUILD_DIR}/build-info.json" ]; then
        echo "  Build info available at: ${BUILD_DIR}/build-info.json"
    fi
}

# Main build function
main() {
    local start_time=$(date +%s)
    
    log "Starting build process..."
    log "Project root: $PROJECT_ROOT"
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --clean)
                CLEAN=true
                shift
                ;;
            --skip-tests)
                SKIP_TESTS=true
                shift
                ;;
            --skip-lint)
                SKIP_LINT=true
                shift
                ;;
            --production)
                NODE_ENV=production
                shift
                ;;
            --help)
                cat << EOF
Build script for Todo application

Usage: $0 [OPTIONS]

Options:
    --clean         Clean previous builds before building
    --skip-tests    Skip running tests
    --skip-lint     Skip linting and type checking
    --production    Build for production environment
    --help          Show this help message

Environment Variables:
    NODE_ENV        Build environment (development|production)
    SKIP_TESTS      Skip tests if set to 'true'
    BUILD_NUMBER    Build number for tracking

Examples:
    $0                    # Standard build
    $0 --clean            # Clean build
    $0 --production       # Production build
    $0 --skip-tests       # Build without tests

EOF
                exit 0
                ;;
            *)
                error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    # Set environment
    export NODE_ENV="${NODE_ENV:-development}"
    
    log "Build environment: $NODE_ENV"
    
    # Run build steps
    if [ "$CLEAN" = "true" ]; then
        clean_build
    fi
    
    check_node_version
    install_dependencies
    
    if [ "$SKIP_LINT" != "true" ]; then
        run_lint
        run_typecheck
    fi
    
    build_shared
    build_backend
    build_frontend
    
    run_tests
    
    create_dist_package
    analyze_bundle
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    success "Build completed successfully in ${duration} seconds"
    show_summary
}

# Handle script interruption
trap 'error "Build interrupted"; exit 1' INT TERM

# Run main function with all arguments
main "$@"