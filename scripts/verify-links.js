#!/usr/bin/env node

/**
 * Script to verify all markdown links in documentation files
 * Checks that:
 * 1. All links are relative (no absolute paths starting with /docs)
 * 2. All links include .md extension
 * 3. Directory links point to index.md explicitly
 * 4. All linked files actually exist
 */

const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const VERSIONED_DOCS_DIR = path.join(__dirname, '..', 'versioned_docs');

// Track all markdown files
const allMarkdownFiles = new Set();

// Track issues found
const issues = [];

/**
 * Recursively find all markdown files
 */
function findMarkdownFiles(dir, baseDir, fileSet) {
  if (!fs.existsSync(dir)) return;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);
    
    if (entry.isDirectory()) {
      findMarkdownFiles(fullPath, baseDir, fileSet);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      fileSet.add(relativePath.replace(/\\/g, '/'));
    }
  }
}

/**
 * Extract all markdown links from a file
 */
function extractLinks(content, filePath) {
  const links = [];
  
  // Match markdown links: [text](link)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  
  while ((match = linkRegex.exec(content)) !== null) {
    const linkText = match[1];
    const linkUrl = match[2];
    
    // Skip external links (http, https, mailto, etc.)
    if (/^(https?|mailto|ftp):/i.test(linkUrl)) {
      continue;
    }
    
    // Skip anchor links (starting with #)
    if (linkUrl.startsWith('#')) {
      continue;
    }
    
    links.push({
      text: linkText,
      url: linkUrl,
      line: content.substring(0, match.index).split('\n').length
    });
  }
  
  return links;
}

/**
 * Resolve a relative link path
 */
function resolveLinkPath(sourceFile, linkUrl, baseDir) {
  // Remove query strings and anchors
  const cleanUrl = linkUrl.split('#')[0].split('?')[0];
  
  // If link starts with /, it's absolute - this is an error
  if (cleanUrl.startsWith('/')) {
    return { error: 'absolute_path', resolved: null };
  }
  
  // Get directory of source file
  const sourceDir = path.dirname(sourceFile);
  
  // Resolve relative path
  const resolvedPath = path.resolve(sourceDir, cleanUrl);
  
  // Make it relative to base directory
  const relativePath = path.relative(baseDir, resolvedPath).replace(/\\/g, '/');
  
  return { error: null, resolved: relativePath };
}

/**
 * Check if a file exists (with or without .md extension, or as index.md)
 */
function fileExists(filePath, allFiles) {
  // Check exact match
  if (allFiles.has(filePath)) {
    return { exists: true, actualPath: filePath };
  }
  
  // Check with .md extension
  if (!filePath.endsWith('.md')) {
    const withMd = filePath + '.md';
    if (allFiles.has(withMd)) {
      return { exists: true, actualPath: withMd, needsFix: 'add_extension' };
    }
  }
  
  // Check as index.md
  if (!filePath.endsWith('/index.md')) {
    const asIndex = filePath.endsWith('/') 
      ? filePath + 'index.md'
      : filePath + '/index.md';
    if (allFiles.has(asIndex)) {
      return { exists: true, actualPath: asIndex, needsFix: 'add_index' };
    }
  }
  
  // Check if it's a directory that should point to index.md
  const dirAsIndex = filePath + '/index.md';
  if (allFiles.has(dirAsIndex)) {
    return { exists: true, actualPath: dirAsIndex, needsFix: 'add_index' };
  }
  
  return { exists: false, actualPath: null };
}

/**
 * Verify links in a single file
 */
function verifyFileLinks(filePath, baseDir, allFiles) {
  const fullPath = path.join(baseDir, filePath);
  
  if (!fs.existsSync(fullPath)) {
    return { errors: [], warnings: [] };
  }
  
  const content = fs.readFileSync(fullPath, 'utf8');
  const links = extractLinks(content, filePath);
  const errors = [];
  const warnings = [];
  
  for (const link of links) {
    const { error, resolved } = resolveLinkPath(filePath, link.url, baseDir);
    
    if (error === 'absolute_path') {
      errors.push({
        line: link.line,
        url: link.url,
        text: link.text,
        issue: 'Absolute path detected - will break in versioned docs',
        fix: 'Convert to relative path'
      });
      continue;
    }
    
    if (!resolved) continue;
    
    // Check if file exists
    const exists = fileExists(resolved, allFiles);
    
    if (!exists.exists) {
      errors.push({
        line: link.line,
        url: link.url,
        text: link.text,
        issue: `File not found: ${resolved}`,
        fix: 'Update link to point to correct file'
      });
    } else if (exists.needsFix) {
      if (exists.needsFix === 'add_extension') {
        warnings.push({
          line: link.line,
          url: link.url,
          text: link.text,
          issue: 'Missing .md extension',
          fix: `Change to: ${exists.actualPath}`
        });
      } else if (exists.needsFix === 'add_index') {
        warnings.push({
          line: link.line,
          url: link.url,
          text: link.text,
          issue: 'Directory link should point to index.md',
          fix: `Change to: ${exists.actualPath}`
        });
      }
    } else {
      // Check if link has proper .md extension
      if (!link.url.endsWith('.md') && !link.url.endsWith('/index.md')) {
        warnings.push({
          line: link.line,
          url: link.url,
          text: link.text,
          issue: 'Link should include .md extension',
          fix: `Add .md extension: ${link.url}.md`
        });
      }
    }
  }
  
  return { errors, warnings };
}

/**
 * Main function
 */
function main() {
  console.log('Finding all markdown files...');
  
  // Find all markdown files
  findMarkdownFiles(DOCS_DIR, DOCS_DIR, allMarkdownFiles);
  findMarkdownFiles(VERSIONED_DOCS_DIR, VERSIONED_DOCS_DIR, allMarkdownFiles);
  
  console.log(`Found ${allMarkdownFiles.size} markdown files\n`);
  
  // Verify current docs
  console.log('Verifying current docs...');
  const currentDocs = Array.from(allMarkdownFiles).filter(f => f.startsWith('docs/'));
  
  for (const file of currentDocs) {
    const { errors, warnings } = verifyFileLinks(file, DOCS_DIR, allMarkdownFiles);
    if (errors.length > 0 || warnings.length > 0) {
      issues.push({
        file,
        errors,
        warnings
      });
    }
  }
  
  // Verify versioned docs
  console.log('Verifying versioned docs...');
  const versionedDocs = Array.from(allMarkdownFiles).filter(f => f.startsWith('versioned_docs/'));
  
  for (const file of versionedDocs) {
    const { errors, warnings } = verifyFileLinks(file, path.dirname(VERSIONED_DOCS_DIR), allMarkdownFiles);
    if (errors.length > 0 || warnings.length > 0) {
      issues.push({
        file,
        errors,
        warnings
      });
    }
  }
  
  // Report results
  console.log('\n=== VERIFICATION RESULTS ===\n');
  
  if (issues.length === 0) {
    console.log('✅ All links are valid!');
    return;
  }
  
  console.log(`Found issues in ${issues.length} files:\n`);
  
  for (const issue of issues) {
    console.log(`\n📄 ${issue.file}`);
    
    if (issue.errors.length > 0) {
      console.log('  ❌ ERRORS:');
      for (const error of issue.errors) {
        console.log(`    Line ${error.line}: ${error.url}`);
        console.log(`      Issue: ${error.issue}`);
        console.log(`      Fix: ${error.fix}`);
      }
    }
    
    if (issue.warnings.length > 0) {
      console.log('  ⚠️  WARNINGS:');
      for (const warning of issue.warnings) {
        console.log(`    Line ${warning.line}: ${warning.url}`);
        console.log(`      Issue: ${warning.issue}`);
        console.log(`      Fix: ${warning.fix}`);
      }
    }
  }
  
  // Summary
  const totalErrors = issues.reduce((sum, i) => sum + i.errors.length, 0);
  const totalWarnings = issues.reduce((sum, i) => sum + i.warnings.length, 0);
  
  console.log(`\n=== SUMMARY ===`);
  console.log(`Files with issues: ${issues.length}`);
  console.log(`Total errors: ${totalErrors}`);
  console.log(`Total warnings: ${totalWarnings}`);
}

if (require.main === module) {
  main();
}

module.exports = { verifyFileLinks, extractLinks, fileExists };

