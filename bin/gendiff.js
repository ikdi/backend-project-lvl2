#!/usr/bin/env node
import { Command, Option } from 'commander';
import genDiff from '../index.js';

const formatOption = new Option('-f, --format [type]', 'output format')
  .choices(['stylish', 'plain', 'json'])
  .default('stylish');

const program = new Command();

program
  .version('0.0.1', '-V, --version', 'output the version number')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<filepath1> <filepath2>')
  .addOption(formatOption)
  .action((filepath1, filepath2, options) => {
    const diff = genDiff(filepath1, filepath2, options.format);
    console.log(diff);
  });

program.parse();
