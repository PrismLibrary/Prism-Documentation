const fs = require('node:fs/promises');
const path = require('node:path');
const {createModel} = require('./model');
const {renderEntry} = require('./render');
const {verify} = require('./verify');

// Static social assets follow the inspected AvantiPoint.Aspire approach:
// content-hashed PNGs, bundled font, separate wide/square/X compositions and
// a strict whole-build audit. No runtime image service or external font request.
module.exports = function prismSocialCards(context) {
  let model;
  return {
    name: 'prism-social-cards',
    getPathsToWatch() {
      return [path.join(__dirname, '**/*'), path.join(context.siteDir, 'docs/samples/images/**/*.png'),
        path.join(context.siteDir, 'static/img/logo-prism-symbol@2x.png')];
    },
    getClientModules() { return [require.resolve('./client')]; },
    async allContentLoaded({allContent, actions}) {
      model = createModel({allContent, siteDir: context.siteDir, siteConfig: context.siteConfig});
      const {fontPath, brandPath, ...publicModel} = model;
      const renderContext = {fontPath, brandPath, siteDir: context.siteDir,
        staticDir: path.join(context.siteDir, 'static'), baseUrl: model.baseUrl};
      const assets = new Set();
      // Bounded concurrency keeps native raster memory predictable in CI/dev.
      const entries = Object.values(model.entries);
      for (let index = 0; index < entries.length; index += 3) {
        const rendered = await Promise.all(entries.slice(index, index + 3).map((entry) => renderEntry(entry, renderContext)));
        rendered.flat().forEach((file) => assets.add(file));
      }
      const generated = path.join(context.siteDir, 'static/social');
      const removeStale = async (directory) => {
        for (const item of await fs.readdir(directory, {withFileTypes: true})) {
          const file = path.join(directory, item.name);
          if (item.isDirectory()) await removeStale(file);
          else if (item.name.endsWith('.png') && !assets.has(file)) await fs.unlink(file);
        }
      };
      await removeStale(generated);
      actions.setGlobalData(publicModel);
      await actions.createData('social-manifest.json', JSON.stringify(publicModel));
      console.log(`[social-cards] Prepared ${entries.length} pages / ${assets.size} static images.`);
    },
    async postBuild({outDir}) {
      const report = await verify({outDir, model});
      const reportDir = path.join(context.generatedFilesDir, 'prism-social-cards');
      await fs.mkdir(reportDir, {recursive: true});
      await fs.writeFile(path.join(reportDir, 'validation.json'), JSON.stringify(report, null, 2));
      console.log(`[social-cards] Verified ${report.pages} HTML pages and ${report.images} PNGs.`);
    },
  };
};
