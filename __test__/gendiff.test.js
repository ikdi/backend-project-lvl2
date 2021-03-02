import { test, expect } from '@jest/globals';
import * as url from 'url';
import * as path from 'path';
import * as fs from 'fs';

import gendiff from '../src/gendiff.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

let expected;

beforeAll(() => {
  expected = readFile('expected.txt');
});

test('find the difference between JSON files', () => {
  const file1Json = getFixturePath('file1.json');
  const file2Json = getFixturePath('file2.json');
  expect(gendiff(file1Json, file2Json)).toBe(expected);
});

test('find the difference between YAML files', () => {
  const file1Json = getFixturePath('file1.yml');
  const file2Json = getFixturePath('file2.yml');
  expect(gendiff(file1Json, file2Json)).toBe(expected);
});