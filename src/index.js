import { resolve } from 'path';
import { readFileSync } from 'fs';
import _ from 'lodash';

const pipe = (...funcs) => funcs.reduce((func1, func2) => (arg) => func2(func1(arg)));
// don't use lodash consciously
const difference = (array1, array2) => array1.filter((item1) => !array2.includes(item1));
const intersection = (array1, array2) => array1.filter((item1) => array2.includes(item1));

const resolveFilepath = (filepath) => resolve(process.cwd(), filepath);
const parseFileAsJson = pipe(resolveFilepath, readFileSync, JSON.parse);

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

const diffToString = (diff) => {
  const body = diff.map(({ key, value, status }) => (
    ` ${DIFF_STATUS_SIGN[status]} ${key}: ${value}`
  ));

  return ['{', ...body, '}'].join('\n');
};

export default (filepath1, filepath2) => {
  const json1 = parseFileAsJson(filepath1);
  const json2 = parseFileAsJson(filepath2);

  const diff = makeDiff(json1, json2);
  const sortedDiff = _.sortBy(diff, ['key', 'status']);

  return diffToString(sortedDiff);
};
