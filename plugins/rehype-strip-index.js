/**
 * Docusaurus rehype plugin to strip /index from link URLs
 * This runs after remark plugins and fixes links that Docusaurus might have added /index to
 */

const { visit } = require('unist-util-visit');

module.exports = function rehypeStripIndex() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'a' && node.properties && node.properties.href) {
        const href = node.properties.href;
        
        // Strip /index from the end of internal doc links
        if (typeof href === 'string' && href.startsWith('/docs/') && href.endsWith('/index')) {
          node.properties.href = href.slice(0, -6); // Remove '/index'
        }
      }
    });
  };
};

