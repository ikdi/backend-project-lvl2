import { resolve, extname } from 'path';
import { readFileSync } from 'fs';
import parse from './parsers.js';
import buildDiff from './buildDiff.js';
import format from './formatters/index.js';

const resolveFilepath = (filepath) => resolve(process.cwd(), filepath);
const getParsername = (filepath) => extname(filepath).slice(1);

const getObjectFromFile = (filepath) => {
  const resolvedFilepath = resolveFilepath(filepath);
  const parsername = getParsername(resolvedFilepath);
  const data = readFileSync(resolvedFilepath);

  return parse(data, parsername);
};

export default (filepath1, filepath2, formatname = 'stylish') => {
  const data1 = getObjectFromFile(filepath1);
  const data2 = getObjectFromFile(filepath2);

  const diff = buildDiff(data1, data2);
  return format(diff, formatname);
};
