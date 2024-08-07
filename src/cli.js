import { Command } from 'commander';
import pageLoader from './index.js';

const program = new Command();

function startPageloader() {
  program
    .name('page-loader')
    .description('Page loader utility')
    .version('1.0.0')
    .arguments('<url>')
    .option('-h, --help', 'Display help for command', () => {
      console.log(program.help());
      process.exit(0);
    })
    .option('-o, --output [dir]', `(default: "${process.cwd()}")`)
    .action(async (url, options) => {
      try {
        await pageLoader(url, options.output);
      } catch (error) {
        console.error('An error occurred:', error.message);
        process.exit(1);
      }
    })
    .parse();
}

export default startPageloader;
