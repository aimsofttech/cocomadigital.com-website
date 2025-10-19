#!/bin/bash

# Production Deployment Script for Cocoma Digital
# This script handles the complete deployment process with optimizations

set -e  # Exit on any error

# Configuration
PROJECT_NAME="cocomadigital"
BUILD_DIR="build"
DEPLOY_DIR="/var/www/cocomadigital.com"
BACKUP_DIR="/var/backups/cocomadigital"
NGINX_CONFIG="/etc/nginx/sites-available/cocomadigital.com"
LOG_FILE="/var/log/deploy-cocomadigital.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a $LOG_FILE
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a $LOG_FILE
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a $LOG_FILE
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a $LOG_FILE
}

# Check if running as root for deployment
check_permissions() {
    if [[ $EUID -ne 0 ]]; then
        error "This script must be run as root for production deployment"
    fi
}

# Pre-deployment checks
pre_deployment_checks() {
    log "Starting pre-deployment checks..."
    
    # Check if build directory exists
    if [ ! -d "$BUILD_DIR" ]; then
        error "Build directory not found. Please run 'npm run build' first."
    fi
    
    # Check if nginx is installed
    if ! command -v nginx &> /dev/null; then
        error "Nginx is not installed. Please install nginx first."
    fi
    
    # Check if node is installed
    if ! command -v node &> /dev/null; then
        error "Node.js is not installed."
    fi
    
    # Check available disk space (need at least 1GB)
    AVAILABLE_SPACE=$(df / | awk 'NR==2{printf "%.0f", $4/1024/1024}')
    if [ $AVAILABLE_SPACE -lt 1 ]; then
        error "Insufficient disk space. Need at least 1GB available."
    fi
    
    log "Pre-deployment checks passed ✓"
}

# Create backup
create_backup() {
    log "Creating backup of current deployment..."
    
    # Create backup directory if it doesn't exist
    mkdir -p $BACKUP_DIR
    
    # Create timestamped backup
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.tar.gz"
    
    if [ -d "$DEPLOY_DIR" ]; then
        tar -czf $BACKUP_FILE -C $(dirname $DEPLOY_DIR) $(basename $DEPLOY_DIR)
        log "Backup created: $BACKUP_FILE ✓"
    else
        log "No existing deployment to backup"
    fi
    
    # Keep only last 5 backups
    cd $BACKUP_DIR
    ls -t backup_*.tar.gz | tail -n +6 | xargs -r rm
    log "Old backups cleaned up ✓"
}

# Deploy application
deploy_application() {
    log "Deploying application..."
    
    # Create deployment directory
    mkdir -p $DEPLOY_DIR
    
    # Copy build files
    rsync -av --delete $BUILD_DIR/ $DEPLOY_DIR/
    
    # Set proper permissions
    chown -R www-data:www-data $DEPLOY_DIR
    find $DEPLOY_DIR -type f -exec chmod 644 {} \;
    find $DEPLOY_DIR -type d -exec chmod 755 {} \;
    
    log "Application deployed ✓"
}

# Configure nginx
configure_nginx() {
    log "Configuring Nginx..."
    
    # Copy nginx configuration
    if [ -f "nginx.conf" ]; then
        cp nginx.conf $NGINX_CONFIG
        
        # Test nginx configuration
        nginx -t || error "Nginx configuration test failed"
        
        # Enable site if not already enabled
        if [ ! -L "/etc/nginx/sites-enabled/cocomadigital.com" ]; then
            ln -s $NGINX_CONFIG /etc/nginx/sites-enabled/cocomadigital.com
        fi
        
        log "Nginx configured ✓"
    else
        warning "nginx.conf not found, skipping nginx configuration"
    fi
}

# Optimize static assets
optimize_assets() {
    log "Optimizing static assets..."
    
    # Install optimization tools if not present
    if ! command -v jpegoptim &> /dev/null; then
        apt-get update && apt-get install -y jpegoptim optipng
    fi
    
    # Optimize images
    find $DEPLOY_DIR -name "*.jpg" -o -name "*.jpeg" | xargs -r jpegoptim --strip-all --max=85
    find $DEPLOY_DIR -name "*.png" | xargs -r optipng -o7
    
    # Set up Brotli compression for static files (if available)
    if command -v brotli &> /dev/null; then
        find $DEPLOY_DIR -type f \( -name "*.js" -o -name "*.css" -o -name "*.html" -o -name "*.json" \) -exec brotli -k -f {} \;
        log "Brotli compression applied ✓"
    fi
    
    log "Asset optimization completed ✓"
}

# Setup SSL (Let's Encrypt)
setup_ssl() {
    log "Setting up SSL certificate..."
    
    if command -v certbot &> /dev/null; then
        # Stop nginx temporarily
        systemctl stop nginx
        
        # Obtain certificate
        certbot certonly --standalone -d cocomadigital.com -d www.cocomadigital.com --non-interactive --agree-tos -m admin@cocomadigital.com
        
        # Update nginx config with actual certificate paths
        sed -i 's|/path/to/ssl/certificate.crt|/etc/letsencrypt/live/cocomadigital.com/fullchain.pem|g' $NGINX_CONFIG
        sed -i 's|/path/to/ssl/private.key|/etc/letsencrypt/live/cocomadigital.com/privkey.pem|g' $NGINX_CONFIG
        sed -i 's|/path/to/ssl/certificate_chain.crt|/etc/letsencrypt/live/cocomadigital.com/chain.pem|g' $NGINX_CONFIG
        
        # Setup automatic renewal
        echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -
        
        log "SSL certificate configured ✓"
    else
        warning "Certbot not found. Please install certbot for SSL setup."
        info "Manual SSL configuration required in nginx.conf"
    fi
}

# Configure firewall
configure_firewall() {
    log "Configuring firewall..."
    
    if command -v ufw &> /dev/null; then
        ufw --force enable
        ufw default deny incoming
        ufw default allow outgoing
        ufw allow ssh
        ufw allow 'Nginx Full'
        ufw allow 80
        ufw allow 443
        
        log "Firewall configured ✓"
    else
        warning "UFW not found. Please configure firewall manually."
    fi
}

# Performance tuning
performance_tuning() {
    log "Applying performance tuning..."
    
    # Nginx performance tuning
    cat >> /etc/nginx/nginx.conf << 'EOF'

# Performance optimizations
worker_processes auto;
worker_rlimit_nofile 65535;

events {
    worker_connections 4096;
    use epoll;
    multi_accept on;
}

http {
    # Basic settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    
    # Buffer sizes
    client_body_buffer_size 128k;
    client_max_body_size 10m;
    client_header_buffer_size 1k;
    large_client_header_buffers 4 4k;
    output_buffers 1 32k;
    postpone_output 1460;
    
    # Timeouts
    client_header_timeout 3m;
    client_body_timeout 3m;
    send_timeout 3m;
    
    # Open file cache
    open_file_cache max=1000 inactive=20s;
    open_file_cache_valid 30s;
    open_file_cache_min_uses 5;
    open_file_cache_errors off;
}
EOF
    
    # System performance tuning
    cat >> /etc/sysctl.conf << 'EOF'

# Network performance tuning
net.core.rmem_max = 134217728
net.core.wmem_max = 134217728
net.ipv4.tcp_rmem = 4096 65536 134217728
net.ipv4.tcp_wmem = 4096 65536 134217728
net.ipv4.tcp_congestion_control = bbr
net.core.default_qdisc = fq
EOF
    
    sysctl -p
    
    log "Performance tuning applied ✓"
}

# Setup monitoring
setup_monitoring() {
    log "Setting up monitoring..."
    
    # Create log rotation
    cat > /etc/logrotate.d/cocomadigital << 'EOF'
/var/log/nginx/cocomadigital.com.*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data adm
    sharedscripts
    postrotate
        systemctl reload nginx
    endscript
}
EOF
    
    # Setup basic monitoring script
    cat > /usr/local/bin/cocomadigital-health-check << 'EOF'
#!/bin/bash
# Health check script for Cocoma Digital

CHECK_URL="https://cocomadigital.com/health"
LOG_FILE="/var/log/cocomadigital-health.log"

response=$(curl -s -o /dev/null -w "%{http_code}" $CHECK_URL)

if [ $response -eq 200 ]; then
    echo "$(date): Site is healthy" >> $LOG_FILE
else
    echo "$(date): Site is down (HTTP $response)" >> $LOG_FILE
    # You can add notification logic here (email, slack, etc.)
fi
EOF
    
    chmod +x /usr/local/bin/cocomadigital-health-check
    
    # Setup cron for health checks
    echo "*/5 * * * * /usr/local/bin/cocomadigital-health-check" | crontab -
    
    log "Monitoring setup completed ✓"
}

# Restart services
restart_services() {
    log "Restarting services..."
    
    # Test nginx config before restart
    nginx -t || error "Nginx configuration test failed"
    
    # Restart nginx
    systemctl restart nginx
    systemctl enable nginx
    
    # Check service status
    if systemctl is-active --quiet nginx; then
        log "Nginx started successfully ✓"
    else
        error "Failed to start Nginx"
    fi
}

# Deployment summary
deployment_summary() {
    log "Deployment Summary:"
    log "=================="
    log "Project: $PROJECT_NAME"
    log "Deploy Directory: $DEPLOY_DIR"
    log "Nginx Config: $NGINX_CONFIG"
    log "Backup Location: $BACKUP_DIR"
    log "Log File: $LOG_FILE"
    log ""
    log "Services Status:"
    systemctl status nginx --no-pager -l
    log ""
    log "🎉 Deployment completed successfully!"
    log "🌐 Website should be accessible at: https://cocomadigital.com"
    log ""
    log "Next Steps:"
    log "1. Update DNS records to point to this server"
    log "2. Test the website thoroughly"
    log "3. Monitor logs for any issues"
    log "4. Setup monitoring and alerting"
}

# Main deployment function
main() {
    log "🚀 Starting Cocoma Digital deployment..."
    
    # Run deployment steps
    check_permissions
    pre_deployment_checks
    create_backup
    deploy_application
    configure_nginx
    optimize_assets
    setup_ssl
    configure_firewall
    performance_tuning
    setup_monitoring
    restart_services
    deployment_summary
}

# Handle script arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "backup")
        create_backup
        ;;
    "optimize")
        optimize_assets
        ;;
    "ssl")
        setup_ssl
        ;;
    "health")
        /usr/local/bin/cocomadigital-health-check
        ;;
    *)
        echo "Usage: $0 {deploy|backup|optimize|ssl|health}"
        echo "  deploy  - Full deployment (default)"
        echo "  backup  - Create backup only"
        echo "  optimize - Optimize assets only"
        echo "  ssl     - Setup SSL only"
        echo "  health  - Run health check"
        exit 1
        ;;
esac