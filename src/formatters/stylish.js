import _ from 'lodash';

const replacer = ' '.repeat(4);
const stringify = (value, depth) => {
  if (!_.isObject(value)) return value;

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

const getPrefix = (indent, symbol, key) => `${indent}  ${symbol} ${key}: `;

const format = (tree) => {
  const iterTree = (currentTree, depth) => {
    const indent = replacer.repeat(depth);
    const lines = _
      .sortBy(currentTree, 'key')
      .flatMap((node) => {
        const {
          key, type, children, afterValue, beforeValue,
        } = node;

        switch (type) {
          case 'added':
            return `${getPrefix(indent, '+', key)}${stringify(afterValue, depth + 1)}`;
          case 'removed':
            return `${getPrefix(indent, '-', key)}${stringify(beforeValue, depth + 1)}`;
          case 'unchanged':
            return `${getPrefix(indent, ' ', key)}${stringify(beforeValue, depth + 1)}`;
          case 'changed':
            return [
              `${getPrefix(indent, '-', key)}${stringify(beforeValue, depth + 1)}`,
              `${getPrefix(indent, '+', key)}${stringify(afterValue, depth + 1)}`,
            ];
          case 'nested':
            return `${getPrefix(indent, ' ', key)}${iterTree(children, depth + 1)}`;
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
