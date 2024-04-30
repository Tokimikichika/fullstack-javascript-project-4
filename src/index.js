import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

const createFileName = (url) => {
  const { hostname, pathname } = new URL(url);
  const baseName = `${hostname}${pathname}`.replace(/[^a-zA-Z0-9]/g, '-');
  return `${baseName}.html`;
};

const pageLoader = (url, outputDir) => {
  let filePath;

  return axios.get(url)
    .then((response) => {
      const fileName = createFileName(url);
      filePath = path.join(outputDir, fileName);
      return fs.writeFile(filePath, response.data); 
    })
    .then(() => filePath) 
    .catch((error) => {
      console.error(`Error occurred while loading the page: ${error.message}`);
      throw error; 
    });
};

export default pageLoader;
