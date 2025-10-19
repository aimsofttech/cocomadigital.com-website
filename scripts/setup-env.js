#!/usr/bin/env node

/**
 * Environment Setup Script
 * Helps switch between local and production configurations
 * 
 * Usage:
 *   node scripts/setup-env.js local     # Switch to local
 *   node scripts/setup-env.js prod      # Switch to production
 *   node scripts/setup-env.js check     # Check current environment
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const packageJsonPath = path.join(projectRoot, 'package.json');
const packageLocalPath = path.join(projectRoot, 'package.local.json');
const packageProdPath = path.join(projectRoot, 'package.production.json');

const envLocalPath = path.join(projectRoot, '.env.local');
const envProdPath = path.join(projectRoot, '.env.production');

function readFile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    return null;
  }
}

function writeFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error writing file ${filePath}:`, err.message);
    return false;
  }
}

function getCurrentEnv() {
  const packageJson = readFile(packageJsonPath);
  return packageJson?.name?.includes('local') ? 'local' : 
         packageJson?.name?.includes('production') ? 'production' : 'unknown';
}

function switchToLocal() {
  console.log('📦 Switching to LOCAL environment...');
  
  const packageLocal = readFile(packageLocalPath);
  if (!packageLocal) {
    console.error('❌ package.local.json not found!');
    return false;
  }
  
  if (!writeFile(packageJsonPath, packageLocal)) {
    return false;
  }
  
  console.log('✅ Switched to LOCAL environment');
  console.log('📝 Configuration:');
  console.log(`   - Name: ${packageLocal.name}`);
  console.log(`   - Homepage: ${packageLocal.homepage}`);
  console.log(`   - Environment: local (development)`);
  console.log('\n💡 Next steps:');
  console.log('   npm install  # Install dependencies');
  console.log('   npm run dev  # Start development server');
  
  return true;
}

function switchToProduction() {
  console.log('📦 Switching to PRODUCTION environment...');
  
  const packageProd = readFile(packageProdPath);
  if (!packageProd) {
    console.error('❌ package.production.json not found!');
    return false;
  }
  
  if (!writeFile(packageJsonPath, packageProd)) {
    return false;
  }
  
  console.log('✅ Switched to PRODUCTION environment');
  console.log('📝 Configuration:');
  console.log(`   - Name: ${packageProd.name}`);
  console.log(`   - Homepage: ${packageProd.homepage}`);
  console.log(`   - Environment: production`);
  console.log('\n💡 Next steps:');
  console.log('   npm install              # Install dependencies');
  console.log('   npm run build:prod       # Build for production');
  console.log('   npm start                # Start production server');
  
  return true;
}

function checkEnvironment() {
  const currentEnv = getCurrentEnv();
  const packageJson = readFile(packageJsonPath);
  
  console.log('\n🔍 Current Environment Status:');
  console.log(`═══════════════════════════════════`);
  console.log(`Environment: ${currentEnv.toUpperCase()}`);
  console.log(`Package Name: ${packageJson?.name}`);
  console.log(`Homepage: ${packageJson?.homepage}`);
  
  // Check if .env files exist
  const hasLocalEnv = fs.existsSync(envLocalPath);
  const hasProdEnv = fs.existsSync(envProdPath);
  
  console.log(`\n📁 Environment Files:`);
  console.log(`   .env.local: ${hasLocalEnv ? '✅' : '❌'}`);
  console.log(`   .env.production: ${hasProdEnv ? '✅' : '❌'}`);
  
  console.log(`\n📦 Package Files:`);
  console.log(`   package.local.json: ${fs.existsSync(packageLocalPath) ? '✅' : '❌'}`);
  console.log(`   package.production.json: ${fs.existsSync(packageProdPath) ? '✅' : '❌'}`);
  console.log(`═══════════════════════════════════\n`);
}

function showHelp() {
  console.log(`
Environment Setup Script
========================

Usage: node scripts/setup-env.js <command>

Commands:
  local      Switch to LOCAL development environment
  prod       Switch to PRODUCTION environment
  production Alias for 'prod'
  check      Check current environment status
  help       Show this help message

Examples:
  node scripts/setup-env.js local    # Switch to local development
  node scripts/setup-env.js prod     # Switch to production
  node scripts/setup-env.js check    # Check current setup

Environment Variables:
  LOCAL: http://localhost:3000 (development)
  PROD:  https://cocoma-website-594958810769.asia-south1.run.app (production)
  `);
}

// Main
const command = process.argv[2]?.toLowerCase() || 'check';

switch (command) {
  case 'local':
    switchToLocal();
    break;
  case 'prod':
  case 'production':
    switchToProduction();
    break;
  case 'check':
  case 'status':
    checkEnvironment();
    break;
  case 'help':
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    console.error(`❌ Unknown command: ${command}\n`);
    showHelp();
    process.exit(1);
}
