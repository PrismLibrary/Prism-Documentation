const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');
const {normalize} = require('./model');

const decode = (value) => value.replace(/&(?:amp|lt|gt|quot|apos|#x27|#39|#x2F);/g,
  (entity) => ({'&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'", '&#x27;': "'", '&#39;': "'", '&#x2F;': '/'}[entity]));
function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)]
    .map((match) => [match[1].toLowerCase(), decode(match[2] ?? match[3])]));
}
async function htmlFiles(root) {
  const result = [];
  for (const entry of await fs.readdir(root, {withFileTypes: true})) {
    const file = path.join(root, entry.name);
    if (entry.isDirectory()) result.push(...await htmlFiles(file));
    else if (entry.name.endsWith('.html')) result.push(file);
  }
  return result;
}
function routeForFile(file, outDir, baseUrl) {
  let route = path.relative(outDir, file).split(path.sep).join('/');
  if (route === '404.html') return normalize(`${baseUrl}404.html`);
  route = route.replace(/(?:^|\/)index\.html$/, '').replace(/\.html$/, '');
  return normalize(`${baseUrl}${route}`);
}
async function verify({outDir, model}) {
  const {entries, baseUrl, siteUrl} = model;
  const files = await htmlFiles(outDir);
  const checked = new Set();
  const report = [];
  for (const file of files) {
    const route = routeForFile(file, outDir, baseUrl);
    const entry = entries[route];
    if (!entry) throw new Error(`Missing page-specific social model for built route: ${route}`);
    const html = await fs.readFile(file, 'utf8');
    if (Buffer.byteLength(html) > 1000000) throw new Error(`HTML exceeds rich-preview project budget: ${route}`);
    const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1];
    if (!head) throw new Error(`No head element: ${route}`);
    const metas = [...head.matchAll(/<meta\b[^>]*>/gi)].map((match) => attributes(match[0]));
    const links = [...head.matchAll(/<link\b[^>]*>/gi)].map((match) => attributes(match[0]));
    function requireValue(name, value, attribute = 'property') {
      const found = metas.filter((meta) => meta[attribute] === name);
      if (found.length !== 1 || found[0].content !== value) throw new Error(`Incorrect/duplicate ${name}: ${route}`);
    }
    const canonical = links.filter((link) => link.rel === 'canonical');
    if (canonical.length !== 1 || canonical[0].href !== entry.canonical) throw new Error(`Canonical mismatch: ${route}`);
    requireValue('og:url', entry.canonical);
    requireValue('og:title', entry.title);
    requireValue('og:description', entry.description);
    requireValue('og:type', entry.type);
    requireValue('og:site_name', 'Prism Library');
    requireValue('description', entry.description, 'name');
    requireValue('twitter:card', 'summary_large_image', 'name');
    requireValue('twitter:title', entry.title, 'name');
    requireValue('twitter:description', entry.description, 'name');
    const twitter = entry.images.find((image) => image.kind === 'twitter');
    requireValue('twitter:image', twitter.url, 'name');
    requireValue('twitter:image:alt', twitter.alt, 'name');
    const og = entry.images.filter((image) => image.kind !== 'twitter');
    const roots = metas.map((meta, index) => meta.property === 'og:image' ? index : -1).filter((index) => index >= 0);
    if (roots.length !== og.length) throw new Error(`Incorrect OG image count: ${route}`);
    for (const [index, root] of roots.entries()) {
      const image = og[index];
      const expected = [
        ['og:image', image.url], ['og:image:secure_url', image.url], ['og:image:type', 'image/png'],
        ['og:image:width', String(image.width)], ['og:image:height', String(image.height)], ['og:image:alt', image.alt],
      ];
      for (const [offset, [property, content]] of expected.entries()) {
        const actual = metas[root + offset];
        if (actual?.property !== property || actual.content !== content || actual['data-prism-social-image'] !== image.url) throw new Error(`OG image grouping/identity mismatch (${property}): ${route}`);
      }
    }
    const icon = links.filter((link) => link.rel === 'apple-touch-icon');
    if (icon.length !== 1 || icon[0].href !== model.icon) throw new Error(`Touch icon mismatch: ${route}`);
    for (const image of entry.images) {
      const url = new URL(image.url);
      if (url.protocol !== 'https:' || url.origin !== new URL(siteUrl).origin || url.search || url.hash) throw new Error(`Invalid public image URL: ${route}`);
      const relative = url.pathname.slice(baseUrl.length).replace(/^\//, '');
      const imageFile = path.join(outDir, relative);
      const data = await fs.readFile(imageFile);
      const meta = await sharp(data).metadata();
      if (meta.format !== 'png' || meta.width !== image.width || meta.height !== image.height) throw new Error(`Image dimensions/type mismatch: ${image.url}`);
      const stats = await sharp(data).resize(64, 64, {fit: 'inside'}).stats();
      if (stats.channels.every((channel) => channel.stdev < 1)) throw new Error(`Blank social card: ${image.url}`);
      if (data.length > (entry.capture ? 1100000 : 450000)) throw new Error(`Social image byte budget exceeded: ${image.url}`);
    }
    checked.add(route);
    report.push({route, title: entry.title, version: entry.version, images: entry.images.map(({url, width, height}) => ({url, width, height}))});
  }
  const unused = Object.keys(entries).filter((route) => !checked.has(route));
  if (unused.length) throw new Error(`Social metadata has no built page: ${unused.join(', ')}`);
  return {pages: files.length, images: files.length * 3, report};
}
module.exports = {verify};
