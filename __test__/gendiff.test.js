import { test, expect } from '@jest/globals';
import * as url from 'url';
import * as path from 'path';
import * as fs from 'fs';

import genDiff from '../index.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const expected = {};
const getExpected = (format) => expected[format];

beforeAll(() => {
  expected.stylish = readFile('expected.stylish.txt');
  expected.plain = readFile('expected.plain.txt');
  expected.json = readFile('expected.json.txt');
});

test.each([
  ['file1.json', 'file2.json', 'stylish'],
  ['file1.yml', 'file2.yml', 'stylish'],
  ['file1.json', 'file2.json', 'plain'],
  ['file1.yml', 'file2.yml', 'plain'],
  ['file1.json', 'file2.json', 'json'],
  ['file1.yml', 'file2.yml', 'json'],
])('difference between %s and %s (%s format)',
  (filename1, filename2, format) => {
    const file1Json = getFixturePath(filename1);
    const file2Json = getFixturePath(filename2);
    const result = getExpected(format);

    expect(genDiff(file1Json, file2Json, format)).toBe(result);
  });
