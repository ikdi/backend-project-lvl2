import YAML from 'js-yaml';

const parsers = {
  json: JSON.parse,
  yml: YAML.load,
  yaml: YAML.load,
};

export default (data, name) => {
  const parse = parsers[name];
  if (!parse) {
    throw new Error(`Unknown format(${name}) for parsing!`);
  }

  return parse(data);
};
