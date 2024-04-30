import { Command } from 'commander';
import pageLoader from './index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();
function startPageloader() {
  program
    .name('page-loader')
    .description('Page loader utility')
    .version('1.0.0')
    .option('-o, --output [dir]', 'output dir', process.cwd())
    .option('-h, --help', 'Display help for command', () => {
      console.log(program.help());
      process.exit(0);
    })
    .arguments('<url>')
    .action((url, options) => {
      const outputDir = options.output || process.cwd();

      pageLoader(url, outputDir)
        .then((downloadedPath) => {
          console.log(downloadedPath);
        })
        .catch((error) => {
          console.error(`Error: ${error.message}`);
          process.exit(1);
        });
    })
    .parse();
}

export default startPageloader;
