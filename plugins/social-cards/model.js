const {createHash} = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const formats = [
  {kind: 'og', width: 1200, height: 630},
  {kind: 'square', width: 1200, height: 1200},
  {kind: 'twitter', width: 1200, height: 600},
];
const rendererVersion = 'prism-social-v1';
const normalize = (route) => route === '/' ? '/' : route.replace(/\/$/, '');
const digest = (value) => createHash('sha256').update(value).digest('hex');
const plain = (value = '') => String(value)
  .replace(/<\/?(?:a|p|b|i|em|strong|code|span|br|div|summary|details|aside)\b[^>]*>/g, '')
  .replace(/\{#[^}]+\}/g, '').replace(/[`*_]/g, '')
  .replace(/&(amp|lt|gt|quot|apos|#\d+|#x[\da-f]+);/gi, (_, entity) => {
    const named = {amp: '&', lt: '<', gt: '>', quot: '\"', apos: "'"};
    if (named[entity.toLowerCase()]) return named[entity.toLowerCase()];
    const code = entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
    return Number.isFinite(code) && code <= 0x10ffff ? String.fromCodePoint(code) : '';
  }).replace(/\s+/g, ' ').trim();
function shorten(value, length) {
  if (value.length <= length) return value;
  const short = value.slice(0, length - 1);
  const space = short.lastIndexOf(' ');
  return `${short.slice(0, space > length * .65 ? space : undefined).replace(/[,:;\s]+$/, '')}…`;
}
function graphicFor(route) {
  const rules = [
    [/region-adapters/, 'adapter'], [/region-behaviors|pagelifecycle|lifetime/, 'layers'],
    [/region-manager/, 'manager'], [/composite-command|event-aggregator/, 'fanout'],
    [/async-command|background/, 'async'], [/commands|commanding/, 'command'],
    [/dialog|popup/, 'dialog'], [/navigation|regions/, 'navigation'],
    [/native-aot/, 'aot'], [/benchmark/, 'chart'], [/dependency-injection|container|register/, 'container'],
    [/modul/, 'modules'], [/logging|error|exception/, 'logging'], [/magician/, 'code'],
    [/store|filesystem|database|cache/, 'storage'], [/permission|biometric|secure|account/, 'shield'],
    [/network|connectivity|browser|launcher|email|communication/, 'network'],
    [/geolocation|geocoding|gps/, 'location'], [/battery|device|sensor|display/, 'device'],
    [/media|camera|video/, 'media'], [/mvvm|bindable|viewmodel/, 'binding'],
    [/sample/, 'apps'], [/migrat|getting-started|introduction/, 'steps'],
    [/platform/, 'platform'], [/search/, 'search'], [/404/, 'missing'],
  ];
  return rules.find(([test]) => test.test(route))?.[1] ?? 'guide';
}
function sectionFor(id) {
  const platform = id.match(/^platforms\/(wpf|maui|uno|avalonia)(?:\/|$)/)?.[1];
  if (platform) return `${{wpf: 'WPF', maui: '.NET MAUI', uno: 'Uno', avalonia: 'Avalonia'}[platform]} guides`;
  const names = {
    commands: 'Commands', mvvm: 'MVVM', dialogs: 'Dialogs', navigation: 'Navigation',
    'dependency-injection': 'Dependency injection', modularity: 'Modularity',
    platforms: 'Platform guides', magician: 'Prism Magician', pipelines: 'Build and release',
    samples: 'Sample applications', plugins: 'Prism plugins',
  };
  if (id.startsWith('plugins/essentials')) return 'Prism Essentials';
  if (id.startsWith('plugins/logging')) return 'Prism Logging';
  return names[id.split('/')[0]] ?? 'Prism documentation';
}
const descriptions = {
  'index': 'Learn Prism application patterns, choose your XAML framework, and follow source-backed guides for commands, dependency injection, navigation and modules.',
  'dependency-injection/native-aot': 'Prepare a NativeAOT application with the supported Microsoft container, static registrations and platform-specific validation. Requires Commercial Plus.',
  'platforms/maui/index': 'Configure Prism startup, page navigation, regions and scoped services in a .NET MAUI application.',
  'platforms/wpf/getting-started': 'Create a WPF application with Prism, connect a view model, configure its container and compose views into a region.',
  'platforms/uno/index': 'Configure a Prism Uno application with WinUI views, Uno.Extensions hosting, region navigation and native dialogs.',
  'platforms/avalonia/index': 'Set up a Prism Avalonia application and understand its shell, application lifetime, region and desktop-dialog boundaries.',
};
function excerpt(value) {
  const sentences = value.match(/.*?[.!?](?:\s+|$)/g);
  if (sentences?.[0]?.trim().length >= 55 && sentences[0].length <= 240) return sentences[0].trim();
  return shorten(value, 240);
}
function sourceExcerpt(siteDir, source, fallback) {
  // Docusaurus's excerpt can consist solely of an explicit H1 anchor. Read a
  // prose paragraph in that case; never use a code block or placeholder as copy.
  const value = plain(fallback);
  if (value.length >= 35 && !/^[\w-]+}$/.test(value) && !/^TODO\b/i.test(value)) return value;
  if (!source?.startsWith('@site/')) return '';
  const filename = path.resolve(siteDir, source.slice('@site/'.length));
  if (!filename.startsWith(`${path.resolve(siteDir)}${path.sep}`)) throw new Error('Social source escaped site directory');
  let body = fs.readFileSync(filename, 'utf8').replace(/^---[\s\S]*?\n---\s*/, '');
  body = body.replace(/```[\s\S]*?```/g, '');
  for (const paragraph of body.split(/\n\s*\n/)) {
    const text = paragraph.trim();
    if (!text || /^(?:#|import\s|<|:::|[-*]\s|\d+\.\s)/.test(text)) continue;
    const prose = plain(text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1'));
    if (prose.length >= 40 && !/^TODO\b/i.test(prose)) return prose;
  }
  return '';
}
const sampleArtwork = {
  calculator: 'calculator-wpf-light.png', planner: 'planner-wpf-board.png',
  'sales-desk': 'sales-desk-wpf-quotes.png', 'learning-hub': 'learning-hub-wpf-catalog.png',
  mail: 'mail-wpf-inbox.png',
};

function createModel({allContent, siteDir, siteConfig}) {
  const entries = {};
  const fontPath = path.join(__dirname, 'assets/Inter.ttf');
  const brandPath = path.join(siteDir, 'static/img/logo-prism-symbol@2x.png');
  const rendererFiles = ['model.js', 'render.js'];
  const rendererHash = digest(Buffer.concat(rendererFiles.map((file) => fs.readFileSync(path.join(__dirname, file)))));
  const assetHash = digest(Buffer.concat([fs.readFileSync(fontPath), fs.readFileSync(brandPath)]));
  const baseUrl = siteConfig.baseUrl;
  const siteUrl = siteConfig.url;
  const urlFor = (route) => new URL(route, siteUrl).href;
  function add({permalink, title, description, id = '', version = '', section, type = 'article', source, frontMatter}) {
    const key = normalize(permalink);
    if (entries[key]) throw new Error(`Duplicate social route: ${permalink}`);
    const cleanTitle = plain(title);
    if (!cleanTitle) throw new Error(`Missing social title: ${permalink}`);
    const cleanDescription = excerpt(plain(frontMatter?.description ?? descriptions[id] ?? sourceExcerpt(siteDir, source, description)) || `${cleanTitle} documentation for Prism${version ? ` ${version}` : ''}.`);
    const artwork = id.startsWith('samples/') ? sampleArtwork[id.slice('samples/'.length)] : undefined;
    const capture = artwork ? path.join(siteDir, 'docs/samples/images', artwork) : undefined;
    const artworkHash = capture ? digest(fs.readFileSync(capture)) : '';
    const graphic = graphicFor(id || permalink);
    const details = {
      route: permalink, title: cleanTitle, description: cleanDescription,
      section: section ?? sectionFor(id), version, graphic, type,
      ...(capture ? {capture: `docs/samples/images/${artwork}`} : {}),
      ...(source ? {source} : {}),
    };
    const hash = digest(JSON.stringify({details, rendererVersion, rendererHash, assetHash, artworkHash})).slice(0, 16);
    const imageId = key === '/' ? 'home' : key.slice(1).replace(/[^a-zA-Z0-9/_-]/g, '-');
    entries[key] = {
      ...details, canonical: urlFor(permalink), hash,
      images: formats.map((format) => ({
        ...format,
        path: `${baseUrl.replace(/\/$/, '')}/social/${imageId}/${format.kind}-${hash}.png`,
        url: urlFor(`${baseUrl.replace(/\/$/, '')}/social/${imageId}/${format.kind}-${hash}.png`),
        alt: format.kind === 'square'
          ? (capture ? `${cleanTitle}: a documented earlier WPF application-owned runtime render in the Prism documentation card. Not an operating-system screenshot.` : `Prism symbol and ${graphic} illustration for ${cleanTitle}, ${version || 'Prism Library'}.`)
          : `${cleanTitle}. ${section ?? sectionFor(id)}. Documentation ${version || 'Prism Library'}.`,
      })),
    };
  }
  function categories(items, version) {
    for (const item of items ?? []) {
      if (item.type !== 'category') continue;
      if (item.link?.type === 'generated-index') {
        add({permalink: item.link.permalink, title: item.link.title ?? item.label,
          description: item.link.description, id: `category/${item.label}`, version: version.label,
          section: item.label, type: 'website'});
      }
      categories(item.items, version);
    }
  }
  for (const content of Object.values(allContent['docusaurus-plugin-content-docs'] ?? {})) {
    for (const version of content.loadedVersions ?? []) {
      for (const doc of version.docs) add({...doc, version: version.label, source: doc.source});
      for (const items of Object.values(version.sidebars ?? {})) categories(items, version);
      const tags = new Map(version.docs.flatMap((doc) => doc.tags ?? []).map((tag) => [tag.permalink, tag]));
      for (const tag of tags.values()) add({permalink: tag.permalink, title: tag.label,
        description: tag.description ?? `Prism ${version.label} guides tagged ${tag.label}.`,
        id: `tags/${tag.label}`, version: version.label, section: 'Documentation tags', type: 'website'});
      if (tags.size) add({permalink: `${version.path.replace(/\/$/, '')}/tags`, title: 'Documentation tags',
        description: `Browse Prism ${version.label} documentation by topic.`, id: 'tags', version: version.label, type: 'website'});
    }
  }
  for (const content of Object.values(allContent['docusaurus-plugin-content-pages'] ?? {})) {
    for (const page of content ?? []) {
      if (page.permalink === baseUrl) continue;
      add({...page, id: page.permalink, section: 'Prism Library', type: 'website'});
    }
  }
  add({permalink: baseUrl, title: 'Prism Library', section: 'XAML application development', type: 'website',
    description: 'Build maintainable XAML applications with shared business logic, dependency injection, navigation, commands and modules across WPF, .NET MAUI, Uno and Avalonia.'});
  add({permalink: `${baseUrl}search`, title: 'Search Prism documentation', id: 'search', type: 'website',
    description: 'Find Prism guides, API patterns and sample application walkthroughs for your framework and documentation version.'});
  add({permalink: `${baseUrl}404.html`, title: 'Page not found', id: '404', type: 'website',
    description: 'This Prism documentation page could not be found. Browse the guides or search for the topic you need.'});
  return {entries, siteUrl, baseUrl, icon: urlFor(`${baseUrl}img/logo-prism-symbol@2x.png`), fontPath, brandPath};
}
module.exports = {createModel, formats, normalize, shorten};
