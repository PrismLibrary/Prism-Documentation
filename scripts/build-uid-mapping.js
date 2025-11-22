/**
 * Utility script to scan all markdown files in the docs directory
 * and build a mapping of UID -> fully qualified path (from project root)
 */

const fs = require('fs');
const path = require('path');

/**
 * Recursively find all markdown files in a directory
 */
function findMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findMarkdownFiles(filePath, fileList);
    } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * Extract UID from frontmatter
 */
function extractUid(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check for frontmatter (starts with ---)
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    return null;
  }
  
  const frontmatter = frontmatterMatch[1];
  const uidMatch = frontmatter.match(/^uid:\s*(.+)$/m);
  
  if (uidMatch) {
    return uidMatch[1].trim();
  }
  
  return null;
}

/**
 * Convert file path to Docusaurus route path
 * e.g., docs/tutorial-basics/create-a-document.md -> /docs/tutorial-basics/create-a-document
 * e.g., docs/navigation/index.md -> /docs/navigation (strips /index)
 */
function getRoutePath(filePath, docsRoot) {
  // Get relative path from docs root
  const relativePath = path.relative(docsRoot, filePath);
  
  // Remove extension
  const withoutExt = relativePath.replace(/\.(md|mdx)$/, '');
  
  // Convert to forward slashes and add leading slash with /docs prefix
  let routePath = '/docs/' + withoutExt.split(path.sep).join('/');
  
  // Strip /index from the end of the path (Docusaurus handles index files automatically)
  if (routePath.endsWith('/index')) {
    routePath = routePath.slice(0, -6); // Remove '/index'
  }
  
  return routePath;
}

/**
 * Build UID mapping from docs directory
 */
function buildUidMapping(docsRoot, projectRoot) {
  const mapping = {};
  const markdownFiles = findMarkdownFiles(docsRoot);
  
  console.log(`Scanning ${markdownFiles.length} markdown files...`);
  
  markdownFiles.forEach(filePath => {
    // Skip tutorial files that are excluded from the build
    const relativePath = path.relative(docsRoot, filePath).replace(/\\/g, '/');
    if (relativePath.startsWith('tutorial-basics/') || relativePath.startsWith('tutorial-extras/')) {
      return;
    }
    const uid = extractUid(filePath);
    if (uid) {
      const routePath = getRoutePath(filePath, docsRoot);
      mapping[uid] = routePath;
      console.log(`  Found UID: ${uid} -> ${routePath}`);
    }
  });
  
  return mapping;
}

// Main execution
if (require.main === module) {
  const projectRoot = path.resolve(__dirname, '..');
  const docsRoot = path.join(projectRoot, 'docs');
  const outputPath = path.join(projectRoot, 'uid-mapping.json');
  
  console.log(`Project root: ${projectRoot}`);
  console.log(`Docs root: ${docsRoot}`);
  
  if (!fs.existsSync(docsRoot)) {
    console.error(`Docs directory not found: ${docsRoot}`);
    process.exit(1);
  }
  
  const mapping = buildUidMapping(docsRoot, projectRoot);
  
  // Write mapping to JSON file
  fs.writeFileSync(outputPath, JSON.stringify(mapping, null, 2), 'utf8');
  
  console.log(`\nUID mapping written to: ${outputPath}`);
  console.log(`Total UIDs found: ${Object.keys(mapping).length}`);
}

module.exports = { buildUidMapping, extractUid, getRoutePath };

