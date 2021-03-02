import YAML from 'js-yaml';

const parsers = {
  json: JSON.parse,
  yml: YAML.load,
};

export default (data, format) => {
  const parse = parsers[format];
  if (!parse) {
    throw new Error(`Unknown data type(${format}) for parsing!`);
  }

  return parse(data);
};
