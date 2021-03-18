import _ from 'lodash';

const formatValue = (value) => {
  if (_.isObject(value)) return '[complex value]';
  if (typeof value === 'string') return `'${value}'`;
  if (value === null) return 'null';

  return value;
};

const getPropertyName = (path, key) => (path === '' ? key : `${path}.${key}`);

const format = (tree) => {
  const iter = (currentTree, path) => currentTree
    .filter(({ type }) => (type !== 'unchanged'))
    .map((node) => {
      const {
        key, type, children, afterValue, beforeValue,
      } = node;
      const propertyName = getPropertyName(path, key);

      switch (type) {
        case 'added':
          return `Property '${propertyName}' was added with value: ${formatValue(afterValue)}`;
        case 'removed':
          return `Property '${propertyName}' was removed`;
        case 'changed':
          return (
            `Property '${propertyName}' was updated. From ${formatValue(beforeValue)} to ${formatValue(afterValue)}`
          );
        case 'nested':
          return iter(children, propertyName);
        default:
          throw new Error(`Unknown node type ${type}!`);
      }
    })
    .join('\n');

  return iter(tree, '');
};

export default format;
