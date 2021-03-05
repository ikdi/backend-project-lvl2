import stylish from './stylish.js';
import plain from './plain.js';

const formatters = { stylish, plain };
export default (name) => {
  const formatter = formatters[name];
  if (!formatter) {
    throw new Error(`Unknow formatter name(${name})!`);
  }

  return formatter;
};
