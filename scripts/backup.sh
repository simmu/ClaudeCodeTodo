#!/bin/bash

# Backup script for the Todo application
# Handles database backups, file backups, and restoration

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
BACKUP_DIR="${BACKUP_DIR:-${PROJECT_ROOT}/backups}"
BACKUP_RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Database configuration
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-todo_prod}"
DB_USER="${DB_USER:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-}"

# S3 configuration for remote backups
S3_BUCKET="${S3_BUCKET:-}"
S3_PREFIX="${S3_PREFIX:-backups/todo}"

# Function to print colored output
log() {
    echo -e "${BLUE}[BACKUP]${NC} $1"
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

# Function to create backup directory
create_backup_dir() {
    if [ ! -d "$BACKUP_DIR" ]; then
        log "Creating backup directory: $BACKUP_DIR"
        mkdir -p "$BACKUP_DIR"
    fi
}

# Function to backup PostgreSQL database
backup_database() {
    log "Starting database backup..."
    
    if ! command_exists pg_dump; then
        error "pg_dump is not installed. Please install PostgreSQL client tools."
        exit 1
    fi
    
    local backup_file="${BACKUP_DIR}/db_backup_${TIMESTAMP}.sql"
    local compressed_backup="${backup_file}.gz"
    
    # Set password if provided
    if [ -n "$DB_PASSWORD" ]; then
        export PGPASSWORD="$DB_PASSWORD"
    fi
    
    log "Creating database backup: $(basename "$backup_file")"
    
    # Create database dump with custom options
    pg_dump \
        --host="$DB_HOST" \
        --port="$DB_PORT" \
        --username="$DB_USER" \
        --dbname="$DB_NAME" \
        --verbose \
        --clean \
        --if-exists \
        --create \
        --format=plain \
        --no-owner \
        --no-privileges > "$backup_file"
    
    # Compress the backup
    log "Compressing database backup..."
    gzip "$backup_file"
    
    # Verify backup
    if [ -f "$compressed_backup" ] && [ -s "$compressed_backup" ]; then
        local size=$(du -sh "$compressed_backup" | cut -f1)
        success "Database backup created: $(basename "$compressed_backup") ($size)"
        echo "$compressed_backup"
    else
        error "Database backup failed or is empty"
        exit 1
    fi
    
    # Clean up password
    unset PGPASSWORD
}

# Function to backup application files
backup_files() {
    log "Starting file backup..."
    
    local backup_file="${BACKUP_DIR}/files_backup_${TIMESTAMP}.tar.gz"
    
    # Files and directories to backup
    local backup_items=(
        "package.json"
        "packages/backend/prisma"
        "docker"
        "scripts"
        ".github"
    )
    
    # Optional items (backup if they exist)
    local optional_items=(
        "uploads"
        "logs"
        ".env.production"
        "ssl"
    )
    
    cd "$PROJECT_ROOT"
    
    # Build tar command
    local tar_items=()
    
    # Add required items
    for item in "${backup_items[@]}"; do
        if [ -e "$item" ]; then
            tar_items+=("$item")
        else
            warning "Required item not found: $item"
        fi
    done
    
    # Add optional items
    for item in "${optional_items[@]}"; do
        if [ -e "$item" ]; then
            tar_items+=("$item")
            info "Including optional item: $item"
        fi
    done
    
    if [ ${#tar_items[@]} -eq 0 ]; then
        error "No files found to backup"
        exit 1
    fi
    
    log "Creating file backup: $(basename "$backup_file")"
    
    # Create compressed archive
    tar -czf "$backup_file" "${tar_items[@]}" \
        --exclude='node_modules' \
        --exclude='dist' \
        --exclude='*.log' \
        --exclude='.git' \
        --exclude='coverage'
    
    # Verify backup
    if [ -f "$backup_file" ] && [ -s "$backup_file" ]; then
        local size=$(du -sh "$backup_file" | cut -f1)
        success "File backup created: $(basename "$backup_file") ($size)"
        echo "$backup_file"
    else
        error "File backup failed or is empty"
        exit 1
    fi
}

# Function to backup Docker volumes
backup_docker_volumes() {
    if ! command_exists docker; then
        warning "Docker not available, skipping volume backup"
        return 0
    fi
    
    log "Starting Docker volume backup..."
    
    local volume_backup_dir="${BACKUP_DIR}/volumes_${TIMESTAMP}"
    mkdir -p "$volume_backup_dir"
    
    # Get list of project-related volumes
    local volumes=$(docker volume ls --filter name=todo --format "{{.Name}}")
    
    if [ -z "$volumes" ]; then
        warning "No Docker volumes found with 'todo' in the name"
        return 0
    fi
    
    for volume in $volumes; do
        log "Backing up Docker volume: $volume"
        
        local volume_backup="${volume_backup_dir}/${volume}.tar.gz"
        
        # Create temporary container to backup volume
        docker run --rm \
            -v "$volume:/data:ro" \
            -v "${volume_backup_dir}:/backup" \
            alpine:latest \
            tar -czf "/backup/${volume}.tar.gz" -C /data .
        
        if [ -f "$volume_backup" ]; then
            local size=$(du -sh "$volume_backup" | cut -f1)
            success "Volume backup created: ${volume}.tar.gz ($size)"
        else
            error "Volume backup failed: $volume"
        fi
    done
    
    # Create overall volumes archive
    if [ "$(ls -A "$volume_backup_dir")" ]; then
        local volumes_archive="${BACKUP_DIR}/volumes_backup_${TIMESTAMP}.tar.gz"
        tar -czf "$volumes_archive" -C "$volume_backup_dir" .
        rm -rf "$volume_backup_dir"
        
        local size=$(du -sh "$volumes_archive" | cut -f1)
        success "Docker volumes backup created: $(basename "$volumes_archive") ($size)"
        echo "$volumes_archive"
    fi
}

# Function to upload backup to S3
upload_to_s3() {
    local backup_file="$1"
    
    if [ -z "$S3_BUCKET" ]; then
        info "S3_BUCKET not configured, skipping remote backup"
        return 0
    fi
    
    if ! command_exists aws; then
        warning "AWS CLI not installed, skipping S3 upload"
        return 0
    fi
    
    log "Uploading backup to S3..."
    
    local s3_key="${S3_PREFIX}/$(basename "$backup_file")"
    
    aws s3 cp "$backup_file" "s3://${S3_BUCKET}/${s3_key}" \
        --storage-class STANDARD_IA \
        --metadata "timestamp=${TIMESTAMP},environment=${ENVIRONMENT:-production}"
    
    success "Backup uploaded to S3: s3://${S3_BUCKET}/${s3_key}"
}

# Function to clean old backups
cleanup_old_backups() {
    log "Cleaning up old backups (older than $BACKUP_RETENTION_DAYS days)..."
    
    local deleted_count=0
    
    # Clean local backups
    if [ -d "$BACKUP_DIR" ]; then
        while IFS= read -r -d '' file; do
            rm "$file"
            ((deleted_count++))
            info "Deleted old backup: $(basename "$file")"
        done < <(find "$BACKUP_DIR" -name "*.sql.gz" -o -name "*.tar.gz" -type f -mtime +${BACKUP_RETENTION_DAYS} -print0 2>/dev/null)
    fi
    
    # Clean S3 backups if configured
    if [ -n "$S3_BUCKET" ] && command_exists aws; then
        local cutoff_date=$(date -d "${BACKUP_RETENTION_DAYS} days ago" +"%Y-%m-%d")
        
        aws s3 ls "s3://${S3_BUCKET}/${S3_PREFIX}/" | while read -r line; do
            local file_date=$(echo "$line" | awk '{print $1}')
            local file_name=$(echo "$line" | awk '{print $4}')
            
            if [[ "$file_date" < "$cutoff_date" ]]; then
                aws s3 rm "s3://${S3_BUCKET}/${S3_PREFIX}/${file_name}"
                ((deleted_count++))
                info "Deleted old S3 backup: $file_name"
            fi
        done
    fi
    
    if [ $deleted_count -gt 0 ]; then
        success "Cleaned up $deleted_count old backup(s)"
    else
        info "No old backups to clean up"
    fi
}

# Function to restore database
restore_database() {
    local backup_file="$1"
    
    if [ -z "$backup_file" ]; then
        error "No backup file specified for restoration"
        exit 1
    fi
    
    if [ ! -f "$backup_file" ]; then
        error "Backup file not found: $backup_file"
        exit 1
    fi
    
    log "Starting database restoration from: $(basename "$backup_file")"
    
    # Confirmation prompt
    read -p "Are you sure you want to restore the database? This will overwrite existing data. (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        error "Database restoration cancelled"
        exit 1
    fi
    
    # Set password if provided
    if [ -n "$DB_PASSWORD" ]; then
        export PGPASSWORD="$DB_PASSWORD"
    fi
    
    # Decompress if needed
    local restore_file="$backup_file"
    if [[ "$backup_file" == *.gz ]]; then
        restore_file="${backup_file%.gz}"
        log "Decompressing backup file..."
        gunzip -c "$backup_file" > "$restore_file"
    fi
    
    # Restore database
    log "Restoring database..."
    psql \
        --host="$DB_HOST" \
        --port="$DB_PORT" \
        --username="$DB_USER" \
        --dbname="postgres" \
        --file="$restore_file"
    
    # Clean up decompressed file if we created it
    if [[ "$backup_file" == *.gz ]] && [ -f "$restore_file" ]; then
        rm "$restore_file"
    fi
    
    # Clean up password
    unset PGPASSWORD
    
    success "Database restoration completed"
}

# Function to list available backups
list_backups() {
    log "Available local backups:"
    
    if [ ! -d "$BACKUP_DIR" ] || [ -z "$(ls -A "$BACKUP_DIR" 2>/dev/null)" ]; then
        info "No local backups found"
    else
        cd "$BACKUP_DIR"
        ls -lht *.sql.gz *.tar.gz 2>/dev/null | while read -r line; do
            echo "  $line"
        done
    fi
    
    if [ -n "$S3_BUCKET" ] && command_exists aws; then
        echo
        log "Available S3 backups:"
        aws s3 ls "s3://${S3_BUCKET}/${S3_PREFIX}/" --human-readable | sort -r
    fi
}

# Function to verify backup integrity
verify_backup() {
    local backup_file="$1"
    
    if [ -z "$backup_file" ]; then
        error "No backup file specified for verification"
        exit 1
    fi
    
    if [ ! -f "$backup_file" ]; then
        error "Backup file not found: $backup_file"
        exit 1
    fi
    
    log "Verifying backup integrity: $(basename "$backup_file")"
    
    if [[ "$backup_file" == *.gz ]]; then
        if gzip -t "$backup_file" >/dev/null 2>&1; then
            success "Backup compression integrity verified"
        else
            error "Backup compression is corrupted"
            exit 1
        fi
        
        # Test content if it's an SQL backup
        if [[ "$backup_file" == *db_backup*.sql.gz ]]; then
            if zcat "$backup_file" | head -n 20 | grep -q "PostgreSQL database dump" >/dev/null 2>&1; then
                success "Database backup content verified"
            else
                error "Database backup content appears corrupted"
                exit 1
            fi
        fi
    elif [[ "$backup_file" == *.tar.gz ]]; then
        if tar -tzf "$backup_file" >/dev/null 2>&1; then
            success "Archive integrity verified"
        else
            error "Archive is corrupted"
            exit 1
        fi
    fi
    
    success "Backup verification completed successfully"
}

# Function to show usage
show_usage() {
    cat << EOF
Backup script for Todo application

Usage: $0 [OPTIONS] [COMMAND]

Commands:
    backup          Create full backup (default)
    backup-db       Backup database only
    backup-files    Backup files only
    restore         Restore database from backup
    list            List available backups
    verify          Verify backup integrity
    cleanup         Clean old backups

Options:
    --db-only       Backup database only
    --files-only    Backup files only
    --no-upload     Skip S3 upload
    --backup-file   Specify backup file for restore/verify
    --help          Show this help message

Environment Variables:
    BACKUP_DIR              Backup directory (default: ./backups)
    BACKUP_RETENTION_DAYS   Days to keep backups (default: 30)
    
    DB_HOST                 Database host (default: localhost)
    DB_PORT                 Database port (default: 5432)
    DB_NAME                 Database name (default: todo_prod)
    DB_USER                 Database user (default: postgres)
    DB_PASSWORD             Database password
    
    S3_BUCKET               S3 bucket for remote backups
    S3_PREFIX               S3 prefix for backup files

Examples:
    $0                      # Full backup
    $0 backup-db            # Database backup only
    $0 restore --backup-file ./backups/db_backup_20231201_120000.sql.gz
    $0 list                 # List available backups
    $0 cleanup              # Clean old backups

EOF
}

# Main function
main() {
    local command="backup"
    local db_only=false
    local files_only=false
    local no_upload=false
    local backup_file=""
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            backup|backup-db|backup-files|restore|list|verify|cleanup)
                command="$1"
                shift
                ;;
            --db-only)
                db_only=true
                shift
                ;;
            --files-only)
                files_only=true
                shift
                ;;
            --no-upload)
                no_upload=true
                shift
                ;;
            --backup-file)
                backup_file="$2"
                shift 2
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
    
    log "Starting backup operation: $command"
    log "Backup directory: $BACKUP_DIR"
    log "Timestamp: $TIMESTAMP"
    
    create_backup_dir
    
    case "$command" in
        backup)
            local backups=()
            
            if [ "$files_only" != "true" ]; then
                backups+=($(backup_database))
            fi
            
            if [ "$db_only" != "true" ]; then
                backups+=($(backup_files))
                backups+=($(backup_docker_volumes))
            fi
            
            # Upload to S3 if configured
            if [ "$no_upload" != "true" ]; then
                for backup in "${backups[@]}"; do
                    if [ -n "$backup" ] && [ -f "$backup" ]; then
                        upload_to_s3 "$backup"
                    fi
                done
            fi
            
            cleanup_old_backups
            
            success "Full backup completed successfully"
            success "Created ${#backups[@]} backup file(s)"
            ;;
        backup-db)
            local db_backup=$(backup_database)
            if [ "$no_upload" != "true" ]; then
                upload_to_s3 "$db_backup"
            fi
            success "Database backup completed"
            ;;
        backup-files)
            local file_backup=$(backup_files)
            local volume_backup=$(backup_docker_volumes)
            if [ "$no_upload" != "true" ]; then
                [ -n "$file_backup" ] && upload_to_s3 "$file_backup"
                [ -n "$volume_backup" ] && upload_to_s3 "$volume_backup"
            fi
            success "File backup completed"
            ;;
        restore)
            restore_database "$backup_file"
            ;;
        list)
            list_backups
            ;;
        verify)
            verify_backup "$backup_file"
            ;;
        cleanup)
            cleanup_old_backups
            ;;
    esac
}

# Handle script interruption
trap 'error "Backup interrupted"; exit 1' INT TERM

# Run main function with all arguments
main "$@"