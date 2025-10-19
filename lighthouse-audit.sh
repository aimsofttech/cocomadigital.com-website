#!/bin/bash

# Lighthouse Audit Automation Script
# Runs comprehensive Lighthouse audits and generates reports

set -e

# Configuration
SITE_URL="https://cocomadigital.com"
REPORT_DIR="lighthouse-reports"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORT_FILE="$REPORT_DIR/lighthouse-report-$TIMESTAMP"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check dependencies
check_dependencies() {
    log "Checking dependencies..."
    
    if ! command -v lighthouse &> /dev/null; then
        error "Lighthouse is not installed. Install with: npm install -g lighthouse"
    fi
    
    if ! command -v node &> /dev/null; then
        error "Node.js is not installed"
    fi
    
    log "Dependencies check passed ✓"
}

# Create report directory
setup_reporting() {
    log "Setting up reporting directory..."
    
    mkdir -p $REPORT_DIR
    mkdir -p $REPORT_DIR/json
    mkdir -p $REPORT_DIR/html
    mkdir -p $REPORT_DIR/csv
    
    log "Report directory created: $REPORT_DIR ✓"
}

# Run Lighthouse audit for desktop
run_desktop_audit() {
    log "Running Lighthouse audit for Desktop..."
    
    lighthouse $SITE_URL \
        --output=json,html,csv \
        --output-path=$REPORT_FILE-desktop \
        --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage" \
        --preset=desktop \
        --throttling-method=provided \
        --quiet
        
    log "Desktop audit completed ✓"
}

# Run Lighthouse audit for mobile
run_mobile_audit() {
    log "Running Lighthouse audit for Mobile..."
    
    lighthouse $SITE_URL \
        --output=json,html,csv \
        --output-path=$REPORT_FILE-mobile \
        --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage" \
        --preset=mobile \
        --throttling-method=simulate \
        --quiet
        
    log "Mobile audit completed ✓"
}

# Run specific page audits
run_page_audits() {
    log "Running audits for specific pages..."
    
    local pages=(
        "/"
        "/about"
        "/services"
        "/blog"
        "/contact"
    )
    
    for page in "${pages[@]}"; do
        info "Auditing page: $page"
        
        lighthouse "${SITE_URL}${page}" \
            --output=json \
            --output-path=$REPORT_FILE-page-$(echo $page | sed 's/\//-/g')-mobile \
            --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage" \
            --preset=mobile \
            --quiet
    done
    
    log "Page-specific audits completed ✓"
}

# Run performance-focused audit
run_performance_audit() {
    log "Running performance-focused audit..."
    
    lighthouse $SITE_URL \
        --output=json \
        --output-path=$REPORT_FILE-performance \
        --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage" \
        --only-categories=performance \
        --preset=mobile \
        --throttling-method=simulate \
        --quiet
        
    log "Performance audit completed ✓"
}

# Analyze results and generate summary
analyze_results() {
    log "Analyzing audit results..."
    
    # Create summary script
    cat > $REPORT_DIR/analyze-results.js << 'EOF'
const fs = require('fs');
const path = require('path');

// Read all JSON reports
const reportDir = process.argv[2];
const files = fs.readdirSync(reportDir).filter(f => f.endsWith('.json'));

let summary = {
    timestamp: new Date().toISOString(),
    audits: [],
    averages: {
        performance: 0,
        accessibility: 0,
        bestPractices: 0,
        seo: 0,
        pwa: 0
    },
    coreWebVitals: {
        lcp: [],
        fid: [],
        cls: []
    },
    opportunities: [],
    diagnostics: []
};

files.forEach(file => {
    try {
        const report = JSON.parse(fs.readFileSync(path.join(reportDir, file), 'utf8'));
        const categories = report.categories;
        
        const auditResult = {
            file: file,
            url: report.finalUrl,
            device: file.includes('mobile') ? 'mobile' : 'desktop',
            scores: {
                performance: Math.round(categories.performance?.score * 100) || 0,
                accessibility: Math.round(categories.accessibility?.score * 100) || 0,
                bestPractices: Math.round(categories['best-practices']?.score * 100) || 0,
                seo: Math.round(categories.seo?.score * 100) || 0,
                pwa: Math.round(categories.pwa?.score * 100) || 0
            },
            metrics: {
                fcp: report.audits['first-contentful-paint']?.numericValue,
                lcp: report.audits['largest-contentful-paint']?.numericValue,
                fid: report.audits['max-potential-fid']?.numericValue,
                cls: report.audits['cumulative-layout-shift']?.numericValue,
                si: report.audits['speed-index']?.numericValue,
                tti: report.audits['interactive']?.numericValue
            }
        };
        
        summary.audits.push(auditResult);
        
        // Collect Core Web Vitals
        if (auditResult.metrics.lcp) summary.coreWebVitals.lcp.push(auditResult.metrics.lcp);
        if (auditResult.metrics.fid) summary.coreWebVitals.fid.push(auditResult.metrics.fid);
        if (auditResult.metrics.cls) summary.coreWebVitals.cls.push(auditResult.metrics.cls);
        
        // Collect opportunities
        Object.values(report.audits).forEach(audit => {
            if (audit.scoreDisplayMode === 'numeric' && audit.score < 0.9 && audit.details?.overallSavingsMs > 100) {
                summary.opportunities.push({
                    title: audit.title,
                    description: audit.description,
                    savings: audit.details.overallSavingsMs,
                    file: file
                });
            }
        });
        
    } catch (error) {
        console.error(`Error processing ${file}:`, error.message);
    }
});

// Calculate averages
if (summary.audits.length > 0) {
    ['performance', 'accessibility', 'bestPractices', 'seo', 'pwa'].forEach(category => {
        const scores = summary.audits.map(a => a.scores[category]).filter(s => s > 0);
        summary.averages[category] = scores.length > 0 ? 
            Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    });
}

// Calculate Core Web Vitals averages
summary.coreWebVitals.avgLcp = summary.coreWebVitals.lcp.length > 0 ? 
    Math.round(summary.coreWebVitals.lcp.reduce((a, b) => a + b, 0) / summary.coreWebVitals.lcp.length) : 0;
summary.coreWebVitals.avgFid = summary.coreWebVitals.fid.length > 0 ? 
    Math.round(summary.coreWebVitals.fid.reduce((a, b) => a + b, 0) / summary.coreWebVitals.fid.length) : 0;
summary.coreWebVitals.avgCls = summary.coreWebVitals.cls.length > 0 ? 
    (summary.coreWebVitals.cls.reduce((a, b) => a + b, 0) / summary.coreWebVitals.cls.length).toFixed(3) : 0;

// Sort opportunities by savings
summary.opportunities.sort((a, b) => b.savings - a.savings);

// Generate recommendations
summary.recommendations = generateRecommendations(summary);

// Save summary
fs.writeFileSync(path.join(reportDir, 'summary.json'), JSON.stringify(summary, null, 2));

// Generate readable report
generateReadableReport(summary, reportDir);

console.log('Analysis complete!');
console.log('Summary saved to:', path.join(reportDir, 'summary.json'));
console.log('Readable report saved to:', path.join(reportDir, 'summary.html'));

function generateRecommendations(summary) {
    const recommendations = [];
    
    if (summary.averages.performance < 90) {
        recommendations.push({
            category: 'Performance',
            priority: 'High',
            issue: 'Performance score below 90',
            suggestion: 'Review and implement the top performance opportunities listed above'
        });
    }
    
    if (summary.coreWebVitals.avgLcp > 2500) {
        recommendations.push({
            category: 'Core Web Vitals',
            priority: 'High',
            issue: 'LCP above 2.5s threshold',
            suggestion: 'Optimize largest contentful paint by improving server response times and optimizing above-the-fold content'
        });
    }
    
    if (summary.coreWebVitals.avgCls > 0.1) {
        recommendations.push({
            category: 'Core Web Vitals',
            priority: 'High',
            issue: 'CLS above 0.1 threshold',
            suggestion: 'Minimize layout shifts by setting dimensions for images and avoiding content insertion above existing content'
        });
    }
    
    if (summary.averages.accessibility < 95) {
        recommendations.push({
            category: 'Accessibility',
            priority: 'Medium',
            issue: 'Accessibility score below 95',
            suggestion: 'Review accessibility issues and ensure proper alt text, color contrast, and keyboard navigation'
        });
    }
    
    return recommendations;
}

function generateReadableReport(summary, reportDir) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lighthouse Audit Summary</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .header { background: #f4f4f4; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .scores { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
        .score-card { background: white; border: 1px solid #ddd; border-radius: 8px; padding: 15px; text-align: center; }
        .score { font-size: 2em; font-weight: bold; margin: 10px 0; }
        .good { color: #0c7; }
        .average { color: #fa3; }
        .poor { color: #f33; }
        .metrics { margin: 20px 0; }
        .metric { display: inline-block; margin: 10px; padding: 10px; background: #f9f9f9; border-radius: 5px; }
        .opportunities { margin: 20px 0; }
        .opportunity { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 10px 0; }
        .recommendations { margin: 20px 0; }
        .recommendation { background: #d1ecf1; border: 1px solid #bee5eb; border-radius: 5px; padding: 15px; margin: 10px 0; }
        .high-priority { border-left: 5px solid #dc3545; }
        .medium-priority { border-left: 5px solid #ffc107; }
        .low-priority { border-left: 5px solid #28a745; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Lighthouse Audit Summary</h1>
        <p>Generated on: ${summary.timestamp}</p>
        <p>Total audits: ${summary.audits.length}</p>
    </div>
    
    <h2>Overall Scores</h2>
    <div class="scores">
        <div class="score-card">
            <h3>Performance</h3>
            <div class="score ${getScoreClass(summary.averages.performance)}">${summary.averages.performance}</div>
        </div>
        <div class="score-card">
            <h3>Accessibility</h3>
            <div class="score ${getScoreClass(summary.averages.accessibility)}">${summary.averages.accessibility}</div>
        </div>
        <div class="score-card">
            <h3>Best Practices</h3>
            <div class="score ${getScoreClass(summary.averages.bestPractices)}">${summary.averages.bestPractices}</div>
        </div>
        <div class="score-card">
            <h3>SEO</h3>
            <div class="score ${getScoreClass(summary.averages.seo)}">${summary.averages.seo}</div>
        </div>
        <div class="score-card">
            <h3>PWA</h3>
            <div class="score ${getScoreClass(summary.averages.pwa)}">${summary.averages.pwa}</div>
        </div>
    </div>
    
    <h2>Core Web Vitals</h2>
    <div class="metrics">
        <div class="metric">
            <strong>LCP:</strong> ${summary.coreWebVitals.avgLcp}ms
            <span class="${summary.coreWebVitals.avgLcp <= 2500 ? 'good' : summary.coreWebVitals.avgLcp <= 4000 ? 'average' : 'poor'}">
                ${summary.coreWebVitals.avgLcp <= 2500 ? '✓' : '⚠'}
            </span>
        </div>
        <div class="metric">
            <strong>FID:</strong> ${summary.coreWebVitals.avgFid}ms
            <span class="${summary.coreWebVitals.avgFid <= 100 ? 'good' : summary.coreWebVitals.avgFid <= 300 ? 'average' : 'poor'}">
                ${summary.coreWebVitals.avgFid <= 100 ? '✓' : '⚠'}
            </span>
        </div>
        <div class="metric">
            <strong>CLS:</strong> ${summary.coreWebVitals.avgCls}
            <span class="${summary.coreWebVitals.avgCls <= 0.1 ? 'good' : summary.coreWebVitals.avgCls <= 0.25 ? 'average' : 'poor'}">
                ${summary.coreWebVitals.avgCls <= 0.1 ? '✓' : '⚠'}
            </span>
        </div>
    </div>
    
    <h2>Top Performance Opportunities</h2>
    <div class="opportunities">
        ${summary.opportunities.slice(0, 5).map(opp => `
            <div class="opportunity">
                <h4>${opp.title}</h4>
                <p>${opp.description}</p>
                <p><strong>Potential savings:</strong> ${opp.savings}ms</p>
            </div>
        `).join('')}
    </div>
    
    <h2>Recommendations</h2>
    <div class="recommendations">
        ${summary.recommendations.map(rec => `
            <div class="recommendation ${rec.priority.toLowerCase()}-priority">
                <h4>${rec.category} - ${rec.priority} Priority</h4>
                <p><strong>Issue:</strong> ${rec.issue}</p>
                <p><strong>Suggestion:</strong> ${rec.suggestion}</p>
            </div>
        `).join('')}
    </div>
    
    <h2>Individual Audit Results</h2>
    <table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>
            <tr>
                <th>URL</th>
                <th>Device</th>
                <th>Performance</th>
                <th>Accessibility</th>
                <th>Best Practices</th>
                <th>SEO</th>
                <th>LCP (ms)</th>
                <th>CLS</th>
            </tr>
        </thead>
        <tbody>
            ${summary.audits.map(audit => `
                <tr>
                    <td>${audit.url}</td>
                    <td>${audit.device}</td>
                    <td class="${getScoreClass(audit.scores.performance)}">${audit.scores.performance}</td>
                    <td class="${getScoreClass(audit.scores.accessibility)}">${audit.scores.accessibility}</td>
                    <td class="${getScoreClass(audit.scores.bestPractices)}">${audit.scores.bestPractices}</td>
                    <td class="${getScoreClass(audit.scores.seo)}">${audit.scores.seo}</td>
                    <td>${audit.metrics.lcp || 'N/A'}</td>
                    <td>${audit.metrics.cls || 'N/A'}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
</body>
</html>
    `;
    
    fs.writeFileSync(path.join(reportDir, 'summary.html'), html);
}

function getScoreClass(score) {
    if (score >= 90) return 'good';
    if (score >= 50) return 'average';
    return 'poor';
}
EOF

    # Run analysis
    node $REPORT_DIR/analyze-results.js $REPORT_DIR
    
    log "Results analysis completed ✓"
}

# Generate performance budget check
check_performance_budget() {
    log "Checking performance budget..."
    
    # Define performance budget
    cat > $REPORT_DIR/performance-budget.json << 'EOF'
{
    "budget": {
        "performance": 90,
        "accessibility": 95,
        "bestPractices": 90,
        "seo": 95,
        "lcp": 2500,
        "fid": 100,
        "cls": 0.1
    }
}
EOF

    # Create budget checker
    cat > $REPORT_DIR/check-budget.js << 'EOF'
const fs = require('fs');
const path = require('path');

const budget = JSON.parse(fs.readFileSync(path.join(__dirname, 'performance-budget.json'), 'utf8')).budget;
const summary = JSON.parse(fs.readFileSync(path.join(__dirname, 'summary.json'), 'utf8'));

let passing = true;
const results = [];

// Check scores
['performance', 'accessibility', 'bestPractices', 'seo'].forEach(category => {
    const score = summary.averages[category];
    const budgetScore = budget[category];
    const pass = score >= budgetScore;
    
    if (!pass) passing = false;
    
    results.push({
        metric: category,
        value: score,
        budget: budgetScore,
        pass: pass,
        difference: score - budgetScore
    });
});

// Check Core Web Vitals
const lcp = summary.coreWebVitals.avgLcp;
const fid = summary.coreWebVitals.avgFid;
const cls = parseFloat(summary.coreWebVitals.avgCls);

if (lcp > budget.lcp) {
    passing = false;
    results.push({
        metric: 'LCP',
        value: lcp,
        budget: budget.lcp,
        pass: false,
        difference: lcp - budget.lcp
    });
}

if (fid > budget.fid) {
    passing = false;
    results.push({
        metric: 'FID',
        value: fid,
        budget: budget.fid,
        pass: false,
        difference: fid - budget.fid
    });
}

if (cls > budget.cls) {
    passing = false;
    results.push({
        metric: 'CLS',
        value: cls,
        budget: budget.cls,
        pass: false,
        difference: cls - budget.cls
    });
}

const budgetResult = {
    passing: passing,
    timestamp: new Date().toISOString(),
    results: results
};

fs.writeFileSync(path.join(__dirname, 'budget-check.json'), JSON.stringify(budgetResult, null, 2));

console.log('Performance Budget Check:', passing ? 'PASSED' : 'FAILED');
if (!passing) {
    console.log('Failed metrics:');
    results.filter(r => !r.pass).forEach(r => {
        console.log(`  ${r.metric}: ${r.value} (budget: ${r.budget}, diff: ${r.difference})`);
    });
    process.exit(1);
}
EOF

    node $REPORT_DIR/check-budget.js
    
    log "Performance budget check completed ✓"
}

# Clean up old reports
cleanup_old_reports() {
    log "Cleaning up old reports..."
    
    # Keep only last 10 reports
    cd $REPORT_DIR
    ls -t lighthouse-report-*.json 2>/dev/null | tail -n +11 | xargs -r rm
    ls -t lighthouse-report-*.html 2>/dev/null | tail -n +11 | xargs -r rm
    ls -t lighthouse-report-*.csv 2>/dev/null | tail -n +11 | xargs -r rm
    
    log "Cleanup completed ✓"
}

# Generate monitoring alert
send_alerts() {
    log "Checking if alerts need to be sent..."
    
    if [ -f "$REPORT_DIR/budget-check.json" ]; then
        local passing=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$REPORT_DIR/budget-check.json', 'utf8')).passing)")
        
        if [ "$passing" = "false" ]; then
            warning "Performance budget exceeded! Consider setting up alerts."
            # Here you would integrate with your alerting system
            # slack, email, pagerduty, etc.
        fi
    fi
}

# Main execution
main() {
    log "🚀 Starting Lighthouse audit automation..."
    
    check_dependencies
    setup_reporting
    
    # Run audits based on arguments
    case "${1:-all}" in
        "desktop")
            run_desktop_audit
            ;;
        "mobile")
            run_mobile_audit
            ;;
        "pages")
            run_page_audits
            ;;
        "performance")
            run_performance_audit
            ;;
        "all")
            run_desktop_audit
            run_mobile_audit
            run_page_audits
            run_performance_audit
            ;;
        *)
            error "Invalid option. Use: desktop, mobile, pages, performance, or all"
            ;;
    esac
    
    analyze_results
    check_performance_budget
    cleanup_old_reports
    send_alerts
    
    log "🎉 Lighthouse audit automation completed!"
    log "📊 Reports available in: $REPORT_DIR"
    log "📈 Summary report: $REPORT_DIR/summary.html"
}

# Script help
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "Lighthouse Audit Automation Script"
    echo ""
    echo "Usage: $0 [option]"
    echo ""
    echo "Options:"
    echo "  all         Run all audits (default)"
    echo "  desktop     Run desktop audit only"
    echo "  mobile      Run mobile audit only"
    echo "  pages       Run page-specific audits"
    echo "  performance Run performance-focused audit"
    echo "  --help      Show this help message"
    echo ""
    echo "Environment variables:"
    echo "  SITE_URL    URL to audit (default: https://cocomadigital.com)"
    echo ""
    exit 0
fi

# Override site URL if provided
if [ ! -z "$2" ]; then
    SITE_URL="$2"
fi

main "$1"