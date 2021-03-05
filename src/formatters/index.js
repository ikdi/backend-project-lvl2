import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

const formatters = { stylish, plain, json };
export default (name) => {
  const formatter = formatters[name];
  if (!formatter) {
    throw new Error(`Unknow formatter name(${name})!`);
  }

  return formatter;
};
