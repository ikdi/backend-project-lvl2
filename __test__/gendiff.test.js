import { test, expect } from '@jest/globals';
import * as url from 'url';
import * as path from 'path';
import * as fs from 'fs';

import genDiff from '../index.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

test.each([
  ['file1.json', 'file2.json', 'stylish', 'expected.stylish.txt'],
  ['file1.yml', 'file2.yml', 'stylish', 'expected.stylish.txt'],
  ['file1.json', 'file2.json', 'plain', 'expected.plain.txt'],
  ['file1.yml', 'file2.yml', 'plain', 'expected.plain.txt'],
  ['file1.json', 'file2.json', 'json', 'expected.json.txt'],
  ['file1.yml', 'file2.yml', 'json', 'expected.json.txt'],
])('difference between %s and %s (%s format)',
  (filename1, filename2, format, expectedFile) => {
    const result = readFile(expectedFile);
    const file1Json = getFixturePath(filename1);
    const file2Json = getFixturePath(filename2);

    expect(genDiff(file1Json, file2Json, format)).toBe(result);
  });
