import _ from 'lodash';
import nodeStatus from '../nodeStatus.js';

const replacer = ' '.repeat(4);

const statusSymbols = {
  [nodeStatus.ADDED]: '+',
  [nodeStatus.REMOVED]: '-',
  [nodeStatus.UNCHANGED]: ' ',
};
const getStatusSymbol = (status) => {
  const symbol = statusSymbols[status];
  if (symbol === undefined) {
    throw new Error(`Cant found symbol for status ${status} `);
  }

  return symbol;
};

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

const iterNode = (currentNode, depth) => {
  const indent = replacer.repeat(depth);
  const {
    key, status, beforeValue, afterValue,
  } = currentNode;

  let rawValue;
  switch (status) {
    case nodeStatus.REMOVED:
      rawValue = beforeValue;
      break;
    case nodeStatus.ADDED:
    case nodeStatus.UNCHANGED:
      rawValue = afterValue;
      break;
    default:
      throw new Error(`Unknown ${status} in iterNode!`);
  }
  const symbol = getStatusSymbol(status);
  const prefix = `  ${symbol} `;
  const value = stringify(rawValue, depth + 1);

  return `${indent}${prefix}${key}: ${value}`;
};

const stylish = (tree) => {
  const iterTree = (currentTree, depth) => {
    const indent = replacer.repeat(depth);

    const lines = _
      .sortBy(currentTree, 'key')
      .flatMap((node) => {
        const { key, status, children } = node;

        if (children) {
          return `${indent}    ${key}: ${iterTree(children, depth + 1)}`;
        }

        return status === nodeStatus.CHANGED
          ? [
            iterNode({ ...node, status: nodeStatus.REMOVED }, depth),
            iterNode({ ...node, status: nodeStatus.ADDED }, depth),
          ]
          : iterNode(node, depth);
      });

    return [
      '{',
      ...lines,
      `${indent}}`,
    ].join('\n');
  };

  return iterTree(tree, 0);
};

export default stylish;
