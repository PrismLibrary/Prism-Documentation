/**
 * Docusaurus remark plugin to convert DocFX xref links to Docusaurus markdown links
 * This maintains the xref:UID format in source files for maintainability
 */

const fs = require('fs');
const path = require('path');
const { visit } = require('unist-util-visit');

// Load UID mapping from a JSON file
let uidMapping = {};

function loadUidMapping() {
  // Try to find uid-mapping.json relative to the project root
  // This plugin runs from the project root context
  const possiblePaths = [
    path.join(process.cwd(), 'uid-mapping.json'),
    path.join(__dirname, '..', 'uid-mapping.json'),
  ];
  
  for (const mappingPath of possiblePaths) {
    if (fs.existsSync(mappingPath)) {
      try {
        uidMapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
        // Only log in development mode
        if (process.env.NODE_ENV !== 'production') {
          console.log(`Loaded UID mapping: ${Object.keys(uidMapping).length} UIDs`);
        }
        return;
      } catch (e) {
        console.warn(`Failed to load uid-mapping.json from ${mappingPath}:`, e.message);
      }
    }
  }
  
  console.warn('No uid-mapping.json found. xref links will not be resolved.');
}

// Initialize on load
loadUidMapping();

module.exports = function remarkXrefLinks() {
  return (tree) => {
    visit(tree, 'link', (node) => {
      if (node.url && typeof node.url === 'string' && node.url.startsWith('xref:')) {
        const uid = node.url.substring(5); // Remove 'xref:' prefix
        
        // Look up the path in the mapping
        if (uidMapping[uid]) {
          let newUrl = uidMapping[uid];
          
          // Strip /index from the end of the path (Docusaurus handles index files automatically)
          // Do this multiple times to be absolutely sure
          while (newUrl.endsWith('/index') || newUrl.endsWith('/index/')) {
            if (newUrl.endsWith('/index/')) {
              newUrl = newUrl.slice(0, -7); // Remove '/index/'
            } else if (newUrl.endsWith('/index')) {
              newUrl = newUrl.slice(0, -6); // Remove '/index'
            }
          }
          
          node.url = newUrl;
        } else {
          console.warn(`Warning: UID not found in mapping: ${uid}`);
          // Leave as-is (will show as broken link in dev)
        }
      }
    });
  };
};

