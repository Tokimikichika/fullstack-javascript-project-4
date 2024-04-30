import nock from 'nock';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import pageLoader from '../src/index.js';

describe('page-loader', () => {
  let outputDir;

  beforeEach(async () => {
    outputDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  });

  it('should download and save page to specified directory', async () => {
    const testUrl = 'http://example.com/test';
    const expectedHtml = '<html><body>Hello, World!</body></html>';

    nock('http://example.com')
      .get('/test')
      .reply(200, expectedHtml);

    const downloadedPath = await pageLoader(testUrl, outputDir);
    const content = await fs.readFile(downloadedPath, 'utf-8');

    expect(downloadedPath).toContain('example-com-test.html');
    expect(content).toEqual(expectedHtml);
  });

  it('should throw error when URL is invalid', async () => {
    const invalidUrl = 'invalid-url';

    await expect(pageLoader(invalidUrl, outputDir)).rejects.toThrow('Request failed with status code 404');
  });
});
