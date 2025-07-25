#!/usr/bin/env node

/**
 * Bundle Analysis Script
 * Analyzes Next.js build output for performance optimization opportunities
 */

const fs = require('fs');
const path = require('path');

const BUILD_DIR = '.next';
const ANALYSIS_OUTPUT = 'performance-analysis.json';

/**
 * Analyze bundle sizes and performance metrics
 */
function analyzeBundles() {
  const buildManifest = path.join(BUILD_DIR, 'build-manifest.json');
  const appBuildManifest = path.join(BUILD_DIR, 'app-build-manifest.json');
  
  if (!fs.existsSync(buildManifest)) {
    console.error('Build manifest not found. Please run `npm run build` first.');
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(buildManifest, 'utf8'));
  const appManifest = fs.existsSync(appBuildManifest) 
    ? JSON.parse(fs.readFileSync(appBuildManifest, 'utf8'))
    : null;

  const analysis = {
    timestamp: new Date().toISOString(),
    bundles: {},
    totalSize: 0,
    recommendations: [],
    performance: {
      firstLoadJS: 0,
      shared: 0,
      chunks: 0
    }
  };

  // Analyze static files
  const staticDir = path.join(BUILD_DIR, 'static');
  if (fs.existsSync(staticDir)) {
    analyzeStaticFiles(staticDir, analysis);
  }

  // Analyze chunks
  if (manifest.pages) {
    analyzePageBundles(manifest.pages, analysis);
  }

  // Generate recommendations
  generateRecommendations(analysis);

  // Output results
  console.log('\n📊 Bundle Analysis Results');
  console.log('═'.repeat(50));
  console.log(`Total Bundle Size: ${formatBytes(analysis.totalSize)}`);
  console.log(`First Load JS: ${formatBytes(analysis.performance.firstLoadJS)}`);
  console.log(`Shared Bundles: ${formatBytes(analysis.performance.shared)}`);
  console.log(`Total Chunks: ${analysis.performance.chunks}`);

  if (analysis.recommendations.length > 0) {
    console.log('\n💡 Optimization Recommendations:');
    analysis.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
  }

  // Save detailed analysis
  fs.writeFileSync(ANALYSIS_OUTPUT, JSON.stringify(analysis, null, 2));
  console.log(`\n📄 Detailed analysis saved to: ${ANALYSIS_OUTPUT}`);

  return analysis;
}

/**
 * Analyze static files (JS, CSS, etc.)
 */
function analyzeStaticFiles(staticDir, analysis) {
  const jsDir = path.join(staticDir, 'chunks');
  const cssDir = path.join(staticDir, 'css');

  if (fs.existsSync(jsDir)) {
    const jsFiles = getAllFiles(jsDir, '.js');
    jsFiles.forEach(file => {
      const stats = fs.statSync(file);
      const relativePath = path.relative(BUILD_DIR, file);
      analysis.bundles[relativePath] = {
        size: stats.size,
        type: 'javascript'
      };
      analysis.totalSize += stats.size;
      analysis.performance.chunks++;
    });
  }

  if (fs.existsSync(cssDir)) {
    const cssFiles = getAllFiles(cssDir, '.css');
    cssFiles.forEach(file => {
      const stats = fs.statSync(file);
      const relativePath = path.relative(BUILD_DIR, file);
      analysis.bundles[relativePath] = {
        size: stats.size,
        type: 'css'
      };
      analysis.totalSize += stats.size;
    });
  }
}

/**
 * Analyze page-specific bundles
 */
function analyzePageBundles(pages, analysis) {
  Object.entries(pages).forEach(([page, files]) => {
    let pageSize = 0;
    files.forEach(file => {
      const fullPath = path.join(BUILD_DIR, file);
      if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        pageSize += stats.size;
        
        if (file.includes('pages/_app') || file.includes('chunks/main')) {
          analysis.performance.shared += stats.size;
        }
      }
    });

    if (page === '/_app') {
      analysis.performance.firstLoadJS = pageSize;
    }
  });
}

/**
 * Generate optimization recommendations
 */
function generateRecommendations(analysis) {
  const recommendations = [];

  // Check bundle sizes
  if (analysis.performance.firstLoadJS > 250 * 1024) { // 250KB
    recommendations.push('First Load JS is large (>250KB). Consider code splitting and lazy loading.');
  }

  if (analysis.totalSize > 1024 * 1024) { // 1MB
    recommendations.push('Total bundle size is large (>1MB). Consider tree shaking and removing unused dependencies.');
  }

  // Check chunk count
  if (analysis.performance.chunks > 50) {
    recommendations.push('Large number of chunks detected. Consider optimizing chunk splitting strategy.');
  }

  // Check for specific optimization opportunities
  const largeBundles = Object.entries(analysis.bundles)
    .filter(([_, bundle]) => bundle.size > 100 * 1024) // 100KB
    .sort((a, b) => b[1].size - a[1].size);

  if (largeBundles.length > 0) {
    recommendations.push(`Large bundles found: ${largeBundles.slice(0, 3).map(([name]) => name).join(', ')}`);
  }

  analysis.recommendations = recommendations;
}

/**
 * Get all files with specific extension recursively
 */
function getAllFiles(dir, ext) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    items.forEach(item => {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith(ext)) {
        files.push(fullPath);
      }
    });
  }
  
  if (fs.existsSync(dir)) {
    traverse(dir);
  }
  
  return files;
}

/**
 * Format bytes to human readable format
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Performance monitoring helper
 */
function monitorPerformance() {
  const performanceData = {
    memory: process.memoryUsage(),
    timing: process.hrtime(),
    platform: {
      node: process.version,
      platform: process.platform,
      arch: process.arch
    }
  };

  console.log('\n⚡ Performance Monitor');
  console.log('─'.repeat(30));
  console.log(`Memory Usage: ${formatBytes(performanceData.memory.heapUsed)} / ${formatBytes(performanceData.memory.heapTotal)}`);
  console.log(`RSS: ${formatBytes(performanceData.memory.rss)}`);
  console.log(`External: ${formatBytes(performanceData.memory.external)}`);
  
  return performanceData;
}

// Main execution
if (require.main === module) {
  console.log('🔍 Starting bundle analysis...\n');
  
  const startTime = process.hrtime.bigint();
  monitorPerformance();
  
  try {
    const analysis = analyzeBundles();
    
    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - startTime) / 1e6; // Convert to milliseconds
    
    console.log(`\n✅ Analysis completed in ${duration.toFixed(2)}ms`);
    
    // Exit with error code if recommendations exist
    if (analysis.recommendations.length > 0) {
      console.log('\n⚠️  Optimization opportunities found!');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
    process.exit(1);
  }
}

module.exports = { analyzeBundles, monitorPerformance };