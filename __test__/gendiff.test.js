import { test, expect } from '@jest/globals';
import * as url from 'url';
import * as path from 'path';
import * as fs from 'fs';

import gendiff from '../src/gendiff.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

let expectedStylish;
let expectedPlain;
let expectedJson;

beforeAll(() => {
  expectedStylish = readFile('expected.stylish.txt');
  expectedPlain = readFile('expected.plain.txt');
  expectedJson = readFile('expected.json.txt');
});

test('find the difference between JSON files (stylish format)', () => {
  const file1Json = getFixturePath('file1.json');
  const file2Json = getFixturePath('file2.json');
  expect(gendiff(file1Json, file2Json, 'stylish')).toBe(expectedStylish);
});

test('find the difference between YAML files (stylish format)', () => {
  const file1Json = getFixturePath('file1.yml');
  const file2Json = getFixturePath('file2.yml');
  expect(gendiff(file1Json, file2Json, 'stylish')).toBe(expectedStylish);
});

test('find the difference between JSON files (plain format)', () => {
  const file1Json = getFixturePath('file1.json');
  const file2Json = getFixturePath('file2.json');
  expect(gendiff(file1Json, file2Json, 'plain')).toBe(expectedPlain);
});

test('find the difference between YAML files (plain format)', () => {
  const file1Json = getFixturePath('file1.yml');
  const file2Json = getFixturePath('file2.yml');
  expect(gendiff(file1Json, file2Json, 'plain')).toBe(expectedPlain);
});

test('find the difference between JSON files (json format)', () => {
  const file1Json = getFixturePath('file1.json');
  const file2Json = getFixturePath('file2.json');
  expect(gendiff(file1Json, file2Json, 'json')).toBe(expectedJson);
});

test('find the difference between YAML files (json format)', () => {
  const file1Json = getFixturePath('file1.yml');
  const file2Json = getFixturePath('file2.yml');
  expect(gendiff(file1Json, file2Json, 'json')).toBe(expectedJson);
});
