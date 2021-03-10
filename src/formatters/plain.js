import _ from 'lodash';

const formatValue = (value) => {
  if (_.isObject(value)) return '[complex value]';
  return typeof value === 'string' ? `'${value}'` : value;
};

const formatAdded = (name, { afterValue }) => (
  `Property '${name}' was added with value: ${formatValue(afterValue)}`
);
const formatRemoved = (name) => `Property '${name}' was removed`;
const formatChanged = (name, { beforeValue, afterValue }) => (
  `Property '${name}' was updated. From ${formatValue(beforeValue)} to ${formatValue(afterValue)}`
);

const nodeFormatters = {
  added: formatAdded,
  removed: formatRemoved,
  changed: formatChanged,
};

const format = (tree) => {
  const iter = (currentTree, path) => _.sortBy(currentTree, 'key')
    .filter(({ type }) => (type !== 'unchanged'))
    .map((node) => {
      const { key, type, children } = node;
      const currentPath = [...path, key];

      if (type === 'nested') {
        return iter(children, currentPath);
      }
      const fullKey = currentPath.join('.');
      const formatNode = nodeFormatters[type];

      return formatNode(fullKey, node);
    })
    .join('\n');

  return iter(tree, []);
};

export default format;
