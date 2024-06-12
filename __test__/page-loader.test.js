import fsp from 'fs/promises';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import nock from 'nock';
import prettier from 'prettier';
import pageLoader from '../src/index.js';

nock.disableNetConnect();

const url = 'https://ru.hexlet.io/courses';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

let outputDir;

beforeEach(async () => {
  nock.cleanAll();
  outputDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

test('page-loader', async () => {
  const resBefore = await fsp.readFile(path.join('.', '__fixtures__', 'before-ru-hexlet-io-courses.html'), 'utf-8');

  const resAfter = await fsp.readFile(path.join('.', '__fixtures__', 'ru-hexlet-io-courses.html'), 'utf-8');

  nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200, resBefore)
    .get('/courses')
    .reply(200, resBefore)
    .get('/assets/application.css')
    .reply(200, 'application.css')
    .get('/packs/js/runtime.js')
    .reply(200, 'runtime.js')
    .get('/assets/professions/nodejs.png')
    .reply(200, 'nodejs.png');

  await pageLoader(url, outputDir);

  const dataBody = await fsp.readFile(path.join(outputDir, 'ru-hexlet-io-courses.html'), 'utf-8');

  const prettierResult = await prettier.format(dataBody, { parser: 'html' });
  const prettierAfter = await prettier.format(resAfter, { parser: 'html' });

  expect(prettierResult).toEqual(prettierAfter);
});

test('error', async () => {
  nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(404, await fsp.readFile(getFixturePath('test1.html'), 'utf-8'));
  nock('https://ru.hexlet.io')
    .get('/assets/professions/nodejs.png')
    .reply(404, await fsp.readFile(getFixturePath('nodejs.png')));
  await expect(pageLoader('https://ru.hexlet.io/courses', '/usr')).rejects.toThrow(new Error('Request failed with status code 404'));
});

test('parsing error', async () => {
  nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200, await fsp.readFile(getFixturePath('expected.json'), 'utf-8'));
  await expect(pageLoader('https://ru.hexlet.io/courses', outputDir)).not.toBeNull();
});

test('dir read error', async () => {
  nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200, await fsp.readFile(getFixturePath('test1.html'), 'utf-8'));
  await expect(pageLoader('https://ru.hexlet.io/courses', '/sys')).rejects.toThrow(new Error('EACCES: permission denied, mkdir \'/sys/ru-hexlet-io-courses_files\''));
});
