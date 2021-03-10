import _ from 'lodash';

const replacer = ' '.repeat(4);
const stringify = (value, depth) => {
  if (!_.isObject(value)) {
    return value;
  }

  const currentIndent = replacer.repeat(depth + 1);
  const bracketIndent = replacer.repeat(depth);
  const lines = Object
    .entries(value)
    .map(([key, val]) => `${currentIndent}${key}: ${stringify(val, depth + 1)}`);

  return [
    '{',
    ...lines,
    `${bracketIndent}}`,
  ].join('\n');
};

const formatAdded = (currentNode, depth) => {
  const indent = replacer.repeat(depth);
  const { key, afterValue } = currentNode;
  const prefix = '  + ';
  const value = stringify(afterValue, depth + 1);

  return `${indent}${prefix}${key}: ${value}`;
};

const formatRemoved = (currentNode, depth) => {
  const indent = replacer.repeat(depth);
  const { key, beforeValue } = currentNode;
  const prefix = '  - ';
  const value = stringify(beforeValue, depth + 1);

  return `${indent}${prefix}${key}: ${value}`;
};

const formatUnchanged = (currentNode, depth) => {
  const indent = replacer.repeat(depth);
  const { key, beforeValue } = currentNode;
  const prefix = '    ';
  const value = stringify(beforeValue, depth + 1);

  return `${indent}${prefix}${key}: ${value}`;
};

const format = (tree) => {
  const iterTree = (currentTree, depth) => {
    const indent = replacer.repeat(depth);

    const lines = _
      .sortBy(currentTree, 'key')
      .flatMap((node) => {
        const { key, type, children } = node;
        switch (type) {
          case 'added':
            return formatAdded(node, depth);
          case 'removed':
            return formatRemoved(node, depth);
          case 'unchanged':
            return formatUnchanged(node, depth);
          case 'changed':
            return [formatRemoved(node, depth), formatAdded(node, depth)];
          case 'nested':
            return `${indent}    ${key}: ${iterTree(children, depth + 1)}`;
          default:
            throw new Error(`Unknown type ${type} when use format stylish!`);
        }
      });

    return [
      '{',
      ...lines,
      `${indent}}`,
    ].join('\n');
  };

  return iterTree(tree, 0);
};

export default format;
