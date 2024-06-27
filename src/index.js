import path from 'path';
import debug from 'debug';
import axios from 'axios';
import 'axios-debug-log';
import Listr from 'listr';
import {
  getDirname,
  getFilename,
  extractAssets,
  writeAssets,
  downloadAsset,
  hasDir,
} from './utility.js';

const log = debug('page-loader');

const pageLoader = async (url, outputassetsDirPath = process.cwd()) => {
  try {
    log(`Page loader has started with url: ${url}, outputassetsDirPath: ${outputassetsDirPath}`);
    const pageUrl = new URL(url);
    const htmlPageFileName = getFilename(pageUrl);
    const htmlPagePath = path.join(outputassetsDirPath, htmlPageFileName);
    const assetsDirName = getDirname(pageUrl);
    const assetsDirPath = path.join(outputassetsDirPath, assetsDirName);

    const { data: html } = await axios.get(url);
    log(`Assets directory path: '${assetsDirPath}'`);
    await hasDir(html, assetsDirPath);

    log('Extracting assets...');
    const extractedData = await extractAssets(html, pageUrl, assetsDirName);
    const { html: newHtml, assets } = extractedData;

    log(`HTML page path: '${htmlPagePath}'`);
    await writeAssets(newHtml, assets, htmlPagePath);

    const tasks = assets.map(({ assetUrl, name }) => {
      const assetPath = path.resolve(assetsDirPath, name);

      return {
        title: `Downloading asset: ${assetUrl.toString()}`,
        task: () => downloadAsset(assetUrl.toString(), assetPath)
          .catch(() => {}),
      };
    });

    const listr = new Listr(tasks, { concurrent: true });
    await listr.run();

    console.log(`Page has been downloaded to: ${htmlPagePath}`);
  } catch (error) {
    log(`Error occurred: ${error.message}`);
    process.exit(1);
  }
};

export default pageLoader;
