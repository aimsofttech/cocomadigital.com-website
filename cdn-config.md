# CDN Configuration for Cocoma Digital

# This configuration can be used with CloudFlare, AWS CloudFront, or similar CDNs

# CloudFlare Page Rules Configuration

# =================================

# Rule 1: Cache static assets with long TTL

# Pattern: cocomadigital.com/static/\*

# Settings:

# - Browser Cache TTL: 1 year

# - Cache Level: Cache Everything

# - Edge Cache TTL: 1 month

# Rule 2: Cache images with medium TTL

# Pattern: cocomadigital.com/Images/\*

# Settings:

# - Browser Cache TTL: 7 days

# - Cache Level: Cache Everything

# - Edge Cache TTL: 7 days

# Rule 3: Service Worker - No Cache

# Pattern: cocomadigital.com/sw.js

# Settings:

# - Browser Cache TTL: 2 hours

# - Cache Level: Bypass

# Rule 4: API endpoints - No Cache

# Pattern: cocomadigital.com/api/\*

# Settings:

# - Cache Level: Bypass

# - Security Level: Medium

# Rule 5: Homepage and dynamic content

# Pattern: cocomadigital.com/\*

# Settings:

# - Browser Cache TTL: 4 hours

# - Cache Level: Standard

# - Edge Cache TTL: 4 hours

# AWS CloudFront Distribution Configuration (JSON)

{
"CallerReference": "cocomadigital-cdn-2025",
"Aliases": {
"Quantity": 2,
"Items": [
"cocomadigital.com",
"www.cocomadigital.com"
]
},
"DefaultRootObject": "index.html",
"Comment": "CDN for Cocoma Digital optimized for performance",
"Enabled": true,
"PriceClass": "PriceClass_All",
"Origins": {
"Quantity": 1,
"Items": [
{
"Id": "cocomadigital-origin",
"DomainName": "origin.cocomadigital.com",
"CustomOriginConfig": {
"HTTPPort": 80,
"HTTPSPort": 443,
"OriginProtocolPolicy": "https-only",
"OriginSslProtocols": {
"Quantity": 3,
"Items": ["TLSv1.2", "TLSv1.1", "TLSv1"]
}
}
}
]
},
"DefaultCacheBehavior": {
"TargetOriginId": "cocomadigital-origin",
"ViewerProtocolPolicy": "redirect-to-https",
"MinTTL": 0,
"DefaultTTL": 14400,
"MaxTTL": 31536000,
"Compress": true,
"ForwardedValues": {
"QueryString": false,
"Cookies": {
"Forward": "none"
},
"Headers": {
"Quantity": 3,
"Items": [
"CloudFront-Viewer-Country",
"CloudFront-Is-Mobile-Viewer",
"CloudFront-Is-Desktop-Viewer"
]
}
},
"TrustedSigners": {
"Enabled": false,
"Quantity": 0
}
},
"CacheBehaviors": {
"Quantity": 4,
"Items": [
{
"PathPattern": "/static/_",
"TargetOriginId": "cocomadigital-origin",
"ViewerProtocolPolicy": "redirect-to-https",
"MinTTL": 31536000,
"DefaultTTL": 31536000,
"MaxTTL": 31536000,
"Compress": true,
"ForwardedValues": {
"QueryString": false,
"Cookies": {"Forward": "none"}
}
},
{
"PathPattern": "/Images/_",
"TargetOriginId": "cocomadigital-origin",
"ViewerProtocolPolicy": "redirect-to-https",
"MinTTL": 604800,
"DefaultTTL": 604800,
"MaxTTL": 604800,
"Compress": true,
"ForwardedValues": {
"QueryString": false,
"Cookies": {"Forward": "none"}
}
},
{
"PathPattern": "/api/\*",
"TargetOriginId": "cocomadigital-origin",
"ViewerProtocolPolicy": "redirect-to-https",
"MinTTL": 0,
"DefaultTTL": 0,
"MaxTTL": 0,
"Compress": false,
"ForwardedValues": {
"QueryString": true,
"Cookies": {"Forward": "all"},
"Headers": {
"Quantity": 5,
"Items": [
"Authorization",
"Content-Type",
"Origin",
"Referer",
"User-Agent"
]
}
}
},
{
"PathPattern": "/sw.js",
"TargetOriginId": "cocomadigital-origin",
"ViewerProtocolPolicy": "redirect-to-https",
"MinTTL": 0,
"DefaultTTL": 7200,
"MaxTTL": 7200,
"Compress": false,
"ForwardedValues": {
"QueryString": false,
"Cookies": {"Forward": "none"}
}
}
]
},
"CustomErrorResponses": {
"Quantity": 2,
"Items": [
{
"ErrorCode": 404,
"ResponsePagePath": "/index.html",
"ResponseCode": "200",
"ErrorCachingMinTTL": 300
},
{
"ErrorCode": 403,
"ResponsePagePath": "/index.html",
"ResponseCode": "200",
"ErrorCachingMinTTL": 300
}
]
},
"ViewerCertificate": {
"CertificateSource": "acm",
"ACMCertificateArn": "arn:aws:acm:us-east-1:ACCOUNT:certificate/CERTIFICATE-ID",
"SSLSupportMethod": "sni-only",
"MinimumProtocolVersion": "TLSv1.2_2021"
},
"WebACLId": "arn:aws:wafv2:us-east-1:ACCOUNT:global/webacl/cocomadigital-protection/WAF-ID"
}

# Nginx Configuration for Origin Server

# =====================================

# Add these headers for CDN optimization

add_header Cache-Control "public, max-age=31536000, immutable" always;

# Static assets - long cache

location ~\* \.(css|js|woff|woff2|ttf|eot)$ {
expires 1y;
add_header Cache-Control "public, immutable";
add_header X-CDN-Cache "static-assets";

    # CORS for CDN
    add_header Access-Control-Allow-Origin "*";
    add_header Access-Control-Allow-Methods "GET, HEAD, OPTIONS";

}

# Images - medium cache

location ~\* \.(png|jpg|jpeg|gif|webp|svg|ico)$ {
expires 7d;
add_header Cache-Control "public";
add_header X-CDN-Cache "images";
add_header Vary "Accept";

    # WebP support
    location ~* \.(jpg|jpeg|png)$ {
        try_files $uri$webp_suffix $uri =404;
    }

}

# Service worker - short cache

location = /sw.js {
expires 2h;
add_header Cache-Control "public, max-age=7200";
add_header X-CDN-Cache "service-worker";
}

# Dynamic content - short cache

location ~\* \.(html|json)$ {
expires 4h;
add_header Cache-Control "public, max-age=14400, must-revalidate";
add_header X-CDN-Cache "dynamic";
}

# CDN Purging Script (CloudFlare)

# ===============================

#!/bin/bash

# purge-cdn.sh - Purge CloudFlare cache

CLOUDFLARE_API_TOKEN="your-api-token"
ZONE_ID="your-zone-id"

# Purge specific files

purge_files() {
curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" \
 -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
 -H "Content-Type: application/json" \
 --data '{"files":["'$1'"]}'
}

# Purge all cache

purge_all() {
curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" \
 -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
 -H "Content-Type: application/json" \
 --data '{"purge_everything":true}'
}

# Usage examples:

# ./purge-cdn.sh file "https://cocomadigital.com/sw.js"

# ./purge-cdn.sh all

case "$1" in
"file")
purge_files "$2"
echo "Purged file: $2"
;;
"all")
purge_all
echo "Purged all cache"
;;
\*)
echo "Usage: $0 {file|all} [url]"
;;
esac

# CDN Performance Monitoring

# ==========================

# Headers to add for monitoring

add_header X-Cache-Status $upstream_cache_status;
add_header X-CDN-Pop $cloudflare_cf_ray;
add_header X-Response-Time $request_time;

# Log CDN performance

log_format cdn_perf '$remote_addr - $remote_user [$time_local] '
'"$request" $status $body_bytes_sent '
                   '"$http_referer" "$http_user_agent" '
                   'rt=$request_time '
'cdn_pop="$http_cf_ray" '
                   'cache_status="$upstream_cache_status"';

access_log /var/log/nginx/cdn-performance.log cdn_perf;

# Real User Monitoring for CDN

# ============================

# JavaScript to track CDN performance

(function() {
// Track CDN cache hits/misses
const trackCDNPerformance = () => {
const resources = performance.getEntriesByType('resource');

        resources.forEach(resource => {
            // Check for CDN headers
            fetch(resource.name, {method: 'HEAD'})
                .then(response => {
                    const cacheStatus = response.headers.get('x-cache-status');
                    const cdnPop = response.headers.get('x-cdn-pop');

                    if (cacheStatus || cdnPop) {
                        // Track CDN metrics
                        rum.trackCustomEvent('CDNPerformance', {
                            url: resource.name,
                            cacheStatus: cacheStatus,
                            cdnPop: cdnPop,
                            duration: resource.duration,
                            size: resource.transferSize
                        });
                    }
                })
                .catch(error => {
                    // Ignore CORS errors for external resources
                });
        });
    };

    // Run after page load
    window.addEventListener('load', () => {
        setTimeout(trackCDNPerformance, 2000);
    });

})();

# Security Configuration for CDN

# ==============================

# Web Application Firewall (WAF) Rules

{
"rules": [
{
"name": "RateLimitAPI",
"priority": 1,
"statement": {
"rateBasedStatement": {
"limit": 100,
"aggregateKeyType": "IP"
}
},
"action": {"block": {}},
"visibilityConfig": {
"sampledRequestsEnabled": true,
"cloudWatchMetricsEnabled": true,
"metricName": "RateLimitAPI"
}
},
{
"name": "SQLInjectionProtection",
"priority": 2,
"statement": {
"sqliMatchStatement": {
"fieldToMatch": {
"allQueryArguments": {}
},
"textTransformations": [
{
"priority": 0,
"type": "URL_DECODE"
},
{
"priority": 1,
"type": "HTML_ENTITY_DECODE"
}
]
}
},
"action": {"block": {}},
"visibilityConfig": {
"sampledRequestsEnabled": true,
"cloudWatchMetricsEnabled": true,
"metricName": "SQLInjectionProtection"
}
}
]
}

# Bot Management

# ==============

# CloudFlare Bot Management settings

{
"bot_management": {
"enable_js_detection": true,
"enable_machine_learning": true,
"fight_mode": false,
"using_latest_model": true,
"auto_update_model": true,
"suppress_session_score": false
}
}

# DDoS Protection

# ===============

# CloudFlare DDoS protection settings

{
"ddos_protection": {
"tcp_protection": {
"enabled": true,
"sensitivity_level": "medium"
},
"http_protection": {
"enabled": true,
"sensitivity_level": "medium"
},
"layer7_ddos_defense": {
"enabled": true,
"sensitivity_level": "medium"
}
}
}
