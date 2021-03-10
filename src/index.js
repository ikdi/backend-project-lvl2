import { resolve, extname } from 'path';
import { readFileSync } from 'fs';
import parse from './parsers.js';
import buildDiff from './buildDiff.js';
import format from './formatters/index.js';

const resolveFilepath = (filepath) => resolve(process.cwd(), filepath);
const getFormat = (filepath) => extname(filepath).slice(1);

const getData = (filepath) => {
  const resolvedFilepath = resolveFilepath(filepath);
  const parsername = getFormat(resolvedFilepath);
  const data = readFileSync(resolvedFilepath);

  return parse(data, parsername);
};

export default (filepath1, filepath2, formatname = 'stylish') => {
  const data1 = getData(filepath1);
  const data2 = getData(filepath2);

  const diff = buildDiff(data1, data2);
  return format(diff, formatname);
};
