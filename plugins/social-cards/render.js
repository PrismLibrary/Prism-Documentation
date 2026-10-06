const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');
const {shorten} = require('./model');
const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'}[c]));

// Original code-drawn topic art. The official Prism symbol is never upscaled.
const art = {
  manager: '<rect x="74" y="72" width="92" height="92" rx="16"/><rect x="8" y="8" width="48" height="48" rx="10"/><rect x="184" y="8" width="48" height="48" rx="10"/><rect x="8" y="184" width="48" height="48" rx="10"/><rect x="184" y="184" width="48" height="48" rx="10"/><path d="M56 56l18 18M166 74l18-18M56 184l18-20M166 164l18 20"/>',
  adapter: '<rect x="8" y="50" width="74" height="130" rx="14"/><rect x="158" y="50" width="74" height="130" rx="14"/><path d="M82 92h76M136 77l22 15-22 15M158 141H82M103 126l-21 15 21 15M28 77h34M178 77h34"/>',
  layers: '<path d="M20 78l100-48 100 48-100 48ZM20 120l100 48 100-48M20 162l100 48 100-48"/>',
  fanout: '<rect x="16" y="83" width="65" height="65" rx="14"/><rect x="170" y="12" width="55" height="55" rx="12"/><rect x="170" y="90" width="55" height="55" rx="12"/><rect x="170" y="168" width="55" height="55" rx="12"/><path d="M81 116h44V39h45M125 116h45M125 116v80h45M187 38l7 8 13-15M187 115l7 8 13-15M187 193l7 8 13-15"/>',
  async: '<circle cx="120" cy="120" r="87"/><path d="M120 58v67l43 28M25 87l8-31 28 13M207 153l-8 31-28-13"/>',
  command: '<rect x="20" y="60" width="200" height="125" rx="26"/><path d="M97 91l51 31-51 32ZM52 28v-15M187 32l12-15M19 206l-11 11"/>',
  dialog: '<rect x="15" y="23" width="210" height="193" rx="20"/><path d="M15 65h210M45 45h4M64 45h4M83 45h4"/><rect x="53" y="96" width="135" height="83" rx="13"/><path d="M72 119h74M124 155h41"/>',
  navigation: '<circle cx="35" cy="120" r="24"/><circle cx="120" cy="40" r="24"/><circle cx="205" cy="120" r="24"/><circle cx="120" cy="200" r="24"/><path d="M53 102l49-44M140 59l46 42M184 140l-46 43M79 179l23 4-4-22M53 138l23 22"/>',
  aot: '<path d="M140 16L40 135h68l-10 90L202 99h-72Z"/>',
  chart: '<path d="M26 18v200h200"/><rect x="48" y="124" width="31" height="70" rx="5"/><rect x="107" y="83" width="31" height="111" rx="5"/><rect x="166" y="36" width="31" height="158" rx="5"/>',
  container: '<path d="M31 64l89-44 89 44v115l-89 43-89-43ZM31 64l89 44 89-44M120 108v114M74 43l88 44"/><path d="M159 146h23M159 163h23"/>',
  modules: '<rect x="21" y="21" width="80" height="80" rx="15"/><rect x="139" y="21" width="80" height="80" rx="15"/><rect x="21" y="139" width="80" height="80" rx="15"/><rect x="139" y="139" width="80" height="80" rx="15"/><path d="M101 61h38M61 101v38M179 101v38M101 179h38"/>',
  logging: '<path d="M30 38h180M30 79h110M30 120h145M30 161h83M30 202h141"/><circle cx="191" cy="178" r="32"/><path d="M182 178l9 9 17-22"/>',
  code: '<path d="M73 53L13 120l60 67M168 53l60 67-60 67M140 28L99 212"/>',
  storage: '<ellipse cx="120" cy="47" rx="89" ry="29"/><path d="M31 47v142c0 39 178 39 178 0V47M31 95c0 39 178 39 178 0M31 143c0 39 178 39 178 0"/>',
  shield: '<path d="M120 15l87 37v68c0 48-41 89-87 108-46-19-87-60-87-108V52ZM77 122l29 28 57-62"/>',
  network: '<circle cx="120" cy="120" r="95"/><ellipse cx="120" cy="120" rx="43" ry="95"/><path d="M28 120h184M40 67h160M40 174h160"/>',
  location: '<path d="M120 221S43 146 43 92a77 77 0 0 1 154 0c0 54-77 129-77 129Z"/><circle cx="120" cy="89" r="28"/>',
  device: '<rect x="56" y="12" width="128" height="216" rx="24"/><path d="M94 34h52M105 205h30M82 67h76v98H82Z"/>',
  media: '<rect x="20" y="48" width="200" height="155" rx="19"/><circle cx="120" cy="128" r="45"/><path d="M60 48l15-25h89l15 25M183 74h9"/>',
  binding: '<rect x="16" y="39" width="83" height="165" rx="13"/><rect x="142" y="39" width="83" height="165" rx="13"/><path d="M41 69h32M41 96h32M99 133h43M122 115l20 18-20 18M41 173h32M164 69h39M164 96h39M164 173h39"/>',
  apps: '<rect x="19" y="24" width="139" height="140" rx="17"/><path d="M19 61h139M59 197h60M89 164v33"/><rect x="157" y="95" width="70" height="126" rx="13"/><path d="M179 199h27"/>',
  steps: '<circle cx="39" cy="49" r="25"/><circle cx="39" cy="122" r="25"/><circle cx="39" cy="195" r="25"/><path d="M39 74v23M39 147v23M86 48h123M86 121h93M86 194h123M28 49l8 8 15-18M28 122l8 8 15-18"/>',
  platform: '<rect x="14" y="28" width="166" height="128" rx="13"/><path d="M50 195h105M97 156v39"/><rect x="164" y="99" width="64" height="122" rx="12"/>',
  search: '<circle cx="98" cy="98" r="71"/><path d="M151 151l70 70"/>',
  missing: '<path d="M56 20h89l42 43v154H56ZM145 20v45h42M85 108l54 54M139 108l-54 54"/>',
  guide: '<path d="M120 52C87 20 47 20 15 37v166c37-16 72-10 105 13 33-23 68-29 105-13V37c-32-17-72-17-105 15ZM120 52v164M38 68c19-4 37 0 56 10M146 78c19-10 37-14 56-10"/>',
};
function background(width, height, graphic, square = false) {
  const x = square ? 350 : 895;
  const y = square ? 315 : 305;
  const scale = square ? 2.1 : .82;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#071a34"/><stop offset="1" stop-color="#123c73"/></linearGradient></defs>
    <rect width="${width}" height="${height}" fill="url(#bg)"/>
    <circle cx="1110" cy="40" r="420" fill="none" stroke="#4db9ef" stroke-opacity=".14" stroke-width="2"/>
    <circle cx="1110" cy="40" r="320" fill="none" stroke="#4db9ef" stroke-opacity=".12" stroke-width="2"/>
    <path d="M72 ${height-82}H${width-72}" stroke="#8abaf1" stroke-opacity=".35"/>
    <rect x="72" y="${height-60}" width="7" height="25" rx="3" fill="#73d8ff"/>
    <g transform="translate(${x} ${y}) scale(${scale})" stroke="#82d6ff" fill="none" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">${art[graphic] ?? art.guide}</g>
  </svg>`);
}
async function text(value, {size, width, color = '#ffffff', bold = false, fontPath}) {
  const {data, info} = await sharp({text: {
    text: `<span foreground="${color}" weight="${bold ? 'bold' : 'normal'}">${escape(value)}</span>`,
    font: `Inter ${size}`, fontfile: fontPath, width, dpi: 72, rgba: true, spacing: 8,
  }}).png().toBuffer({resolveWithObject: true});
  return {input: data, width: info.width, height: info.height};
}
async function fitText(value, options, maxHeight, minimum) {
  for (let size = options.size; size >= minimum; size -= 2) {
    const rendered = await text(value, {...options, size});
    if (rendered.height <= maxHeight) return rendered;
  }
  throw new Error(`Social card text overflow: ${value}`);
}
async function render(entry, format, context) {
  const {width, height, kind} = format;
  const square = kind === 'square';
  const {fontPath, brandPath, siteDir} = context;
  const overlays = [];
  const placeText = async (value, options, left, top, maxHeight, minimum) => {
    const rendered = await fitText(value, {...options, fontPath}, maxHeight, minimum ?? options.size);
    if (left === null) left = Math.round((width - rendered.width) / 2);
    if (top + rendered.height > height - 22 || left + rendered.width > width - 22) throw new Error(`Social card bounds: ${entry.route}`);
    overlays.push({input: rendered.input, left, top});
  };
  const logo = await sharp(brandPath).resize(156, 156, {withoutEnlargement: true}).png().toBuffer();
  overlays.push({input: logo, left: square ? 522 : 956, top: square ? 100 : 52});
  if (square) {
    await placeText('Prism Library', {size: 35, width: 600, bold: true}, null, 264, 70);
    await placeText(entry.title, {size: 56, width: 990, bold: true}, 105, 885, 155, 42);
    await placeText(entry.version ? `DOCUMENTATION · ${entry.version}` : entry.section, {size: 23, width: 1010, color: '#a6d3ff'}, 105, 1140, 42);
  } else {
    await placeText('Prism Library', {size: 29, width: 700, bold: true}, 72, 59, 45);
    await placeText(entry.section.toUpperCase(), {size: 19, width: 810, color: '#88d5ff', bold: true}, 72, 118, 62, 17);
    await placeText(entry.title, {size: 62, width: 785, bold: true}, 72, 206, 166, 46);
    await placeText(shorten(entry.description, 165), {size: 25, width: 760, color: '#d2e5fb'}, 72, 391, 113, 21);
    await placeText(entry.version ? `DOCUMENTATION · ${entry.version}` : 'Guides and sample applications', {size: 21, width: 900, color: '#b3d6fb'}, 96, height - 58, 34);
  }
  let canvas = sharp(background(width, height, entry.graphic, square));
  if (entry.capture && square) {
    const capture = await sharp(path.join(siteDir, entry.capture)).resize(970, 530, {fit: 'contain', background: '#10294c', withoutEnlargement: true}).png().toBuffer();
    overlays.push({input: capture, left: 115, top: 325});
    await placeText('WPF · application-owned runtime render', {size: 20, width: 980, color: '#b3d6fb'}, 115, 1070, 40);
  }
  // Use actual sample art in the graphical square alternative. Wide and X cards
  // retain legible topic typography; no capture is labelled as another host.
  return canvas.composite(overlays).png({compressionLevel: 9}).toBuffer();
}
async function renderEntry(entry, context) {
  const results = [];
  for (const format of entry.images) {
    const relative = format.path.slice(context.baseUrl.replace(/\/$/, '').length).replace(/^\//, '');
    const file = path.join(context.staticDir, relative);
    try { await fs.access(file); results.push(file); continue; } catch {}
    const data = await render(entry, format, context);
    if (data.length > (entry.capture ? 1100000 : 450000)) throw new Error(`Social image exceeds project byte budget: ${entry.route} ${format.kind}`);
    await fs.mkdir(path.dirname(file), {recursive: true});
    await fs.writeFile(file, data);
    results.push(file);
  }
  return results;
}
module.exports = {renderEntry, render};
