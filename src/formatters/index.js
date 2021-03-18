import formatStylish from './stylish.js';
import formatPlain from './plain.js';

const formatJson = (tree) => JSON.stringify(tree);

const formatters = { stylish: formatStylish, plain: formatPlain, json: formatJson };
export default (data, name) => {
  const format = formatters[name];
  if (!format) {
    throw new Error(`Unknown formatter name(${name})!`);
  }

  return format(data);
};
