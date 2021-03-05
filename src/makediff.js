import nodeStatus from './nodeStatus.js';

const difference = (array1, array2) => array1.filter((item1) => !array2.includes(item1));
const intersection = (array1, array2) => array1.filter((item1) => array2.includes(item1));
const isObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

const makediff = (beforeObject, afterObject) => {
  const beforeObjectKeys = Object.keys(beforeObject);
  const afterObjectKeys = Object.keys(afterObject);

  const unchangedKeys = intersection(beforeObjectKeys, afterObjectKeys);

  const removedNodes = difference(beforeObjectKeys, afterObjectKeys)
    .map((key) => (
      {
        key,
        type: 'node',
        beforeValue: beforeObject[key],
        afterValue: undefined,
        status: nodeStatus.REMOVED,
      }
    ));

  const addedNodes = difference(afterObjectKeys, beforeObjectKeys)
    .map((key) => (
      {
        key,
        type: 'node',
        beforeValue: undefined,
        afterValue: afterObject[key],
        status: nodeStatus.ADDED,
      }
    ));

  const changedOrUnchangedNodes = unchangedKeys
    .filter((key) => (
      !(isObject(beforeObject[key]) && isObject(afterObject[key]))
    ))
    .map((key) => {
      const type = 'node';
      const beforeValue = beforeObject[key];
      const afterValue = afterObject[key];
      const status = beforeValue === afterValue ? nodeStatus.UNCHANGED : nodeStatus.CHANGED;

      return {
        key, type, beforeValue, afterValue, status,
      };
    });

  const treeNodes = unchangedKeys
    .filter((key) => (
      isObject(beforeObject[key]) && isObject(afterObject[key])
    ))
    .map((key) => {
      const type = 'tree';
      const beforeValue = beforeObject[key];
      const afterValue = afterObject[key];
      const status = nodeStatus.UNCHANGED;
      const children = makediff(beforeValue, afterValue);

      return {
        key, type, children: [...children], status,
      };
    });

  return [...removedNodes, ...addedNodes, ...changedOrUnchangedNodes, ...treeNodes];
};

export default makediff;
