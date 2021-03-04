import _ from 'lodash';
import { STATUS, getStatusSymbol } from './diffstatus.js';

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

const iterNode = (currentNode, depth) => {
  const indent = replacer.repeat(depth);
  const {
    key, status, beforeValue, afterValue,
  } = currentNode;

  let rawValue;
  switch (status) {
    case STATUS.REMOVED:
      rawValue = beforeValue;
      break;
    case STATUS.ADDED:
      rawValue = afterValue;
      break;
    case STATUS.UNCHANGED:
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
        const {
          key, type, status, children,
        } = node;

        if (type === 'tree') {
          return `${indent}    ${key}: ${iterTree(children, depth + 1)}`;
        }

        return status === STATUS.CHANGED
          ? [
            iterNode({ ...node, status: STATUS.REMOVED }, depth),
            iterNode({ ...node, status: STATUS.ADDED }, depth),
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
