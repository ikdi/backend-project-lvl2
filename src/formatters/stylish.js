import _ from 'lodash';

const makeIndent = (count, size = 4) => ' '.repeat(size).repeat(Math.max(count, 0));
const stringify = (value, depth) => {
  if (!_.isObject(value)) return value;

  const currentIndent = makeIndent(depth + 2);
  const bracketIndent = makeIndent(depth + 1);
  const lines = Object
    .entries(value)
    .map(([key, val]) => `${currentIndent}${key}: ${stringify(val, depth + 1)}`);

  return [
    '{',
    ...lines,
    `${bracketIndent}}`,
  ].join('\n');
};

const format = (tree) => {
  const iterTree = (currentTree, depth) => {
    const indent = makeIndent(depth);
    const lines = currentTree
      .flatMap((node) => {
        const {
          key, type, children, afterValue, beforeValue,
        } = node;

        switch (type) {
          case 'added':
            return `${indent}  + ${key}: ${stringify(afterValue, depth)}`;
          case 'removed':
            return `${indent}  - ${key}: ${stringify(beforeValue, depth)}`;
          case 'unchanged':
            return `${indent}    ${key}: ${stringify(beforeValue, depth)}`;
          case 'changed':
            return [
              `${indent}  - ${key}: ${stringify(beforeValue, depth)}`,
              `${indent}  + ${key}: ${stringify(afterValue, depth)}`,
            ];
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
