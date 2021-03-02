import { resolve, extname } from 'path';
import { readFileSync } from 'fs';
import _ from 'lodash';
import parse from './parsers.js';

// I don't use lodash consciously
const difference = (array1, array2) => array1.filter((item1) => !array2.includes(item1));
const intersection = (array1, array2) => array1.filter((item1) => array2.includes(item1));
const resolveFilepath = (filepath) => resolve(process.cwd(), filepath);

const DIFF_STATUS = {
  REMOVED: -1,
  UNCHANGED: 0,
  ADDED: 1,
};

const DIFF_STATUS_SIGN = {
  [DIFF_STATUS.REMOVED]: '-',
  [DIFF_STATUS.UNCHANGED]: ' ',
  [DIFF_STATUS.ADDED]: '+',
};

const makeDiff = (object1, object2) => {
  const keysObject1 = Object.keys(object1);
  const keysObject2 = Object.keys(object2);

  const removedKeys = difference(keysObject1, keysObject2);
  const addedKeys = difference(keysObject2, keysObject1);
  const unchangedKeys = intersection(keysObject1, keysObject2);

  const removed = removedKeys.map((key) => (
    { key, value: object1[key], status: DIFF_STATUS.REMOVED }
  ));

  const added = addedKeys.map((key) => (
    { key, value: object2[key], status: DIFF_STATUS.ADDED }
  ));

  const unchanged = unchangedKeys
    .filter((key) => object1[key] === object2[key])
    .map((key) => (
      { key, value: object1[key], status: DIFF_STATUS.UNCHANGED }
    ));

  const changed = unchangedKeys
    .filter((key) => object1[key] !== object2[key])
    .reduce((acc, key) => [...acc,
      { key, value: object1[key], status: DIFF_STATUS.REMOVED },
      { key, value: object2[key], status: DIFF_STATUS.ADDED },
    ], []);

  return [...removed, ...added, ...unchanged, ...changed];
};

const stringify = (diffObject) => {
  const body = diffObject.map(({ key, value, status }) => (
    `  ${DIFF_STATUS_SIGN[status]} ${key}: ${value}`
  ));

  return ['{', ...body, '}'].join('\n');
};

const getFormatByFilepath = (filepath) => extname(filepath).slice(1);

const getObjectFromFile = (filepath) => {
  const resolvedFilepath = resolveFilepath(filepath);
  const format = getFormatByFilepath(resolvedFilepath);
  const data = readFileSync(resolvedFilepath);

  return parse(data, format);
};

export default (filepath1, filepath2) => {
  const object1 = getObjectFromFile(filepath1);
  const object2 = getObjectFromFile(filepath2);

  const diff = makeDiff(object1, object2);
  const sortedDiff = _.sortBy(diff, ['key', 'status']);

  return stringify(sortedDiff);
};
