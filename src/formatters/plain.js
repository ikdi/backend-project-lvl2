import _ from 'lodash';
import nodeStatus from '../nodeStatus.js';

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

const statusFormatters = {
  [nodeStatus.ADDED]: formatAdded,
  [nodeStatus.REMOVED]: formatRemoved,
  [nodeStatus.CHANGED]: formatChanged,
};

export const getFormatterByStatus = (status) => {
  const formatter = statusFormatters[status];
  if (formatter === undefined) {
    throw new Error(`Cannot find formatter for status ${status} `);
  }

  return formatter;
};

const format = (tree) => {
  const iter = (currentTree, path) => _.sortBy(currentTree, 'key')
    .filter(({ type, status }) => (type === 'tree' || status !== nodeStatus.UNCHANGED))
    .map((node) => {
      const {
        key, type, status, children,
      } = node;
      const currentPath = [...path, key];
      if (type === 'tree') {
        return iter(children, currentPath);
      }
      const fullKey = currentPath.join('.');
      const nodeFormat = getFormatterByStatus(status);

      return nodeFormat(fullKey, node);
    })
    .join('\n');

  return iter(tree, []);
};

export default format;
