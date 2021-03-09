import _ from 'lodash';
import nodeStatus from './nodeStatus.js';

const isObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

const buildDiff = (data1, data2) => {
  const keys = _.union(Object.keys(data1), Object.keys(data2));
  return keys.map((key) => {
    const beforeValue = data1[key];
    const afterValue = data2[key];

    if (!_.has(data1, key)) {
      return {
        key,
        beforeValue,
        afterValue,
        status: nodeStatus.ADDED,
      };
    }

    if (!(_.has(data2, key))) {
      return {
        key,
        beforeValue,
        afterValue,
        status: nodeStatus.REMOVED,
      };
    }

    if (beforeValue === afterValue) {
      return {
        key,
        beforeValue,
        afterValue,
        status: nodeStatus.UNCHANGED,
      };
    }

    const oneValueSimple = !isObject(beforeValue) || !isObject(afterValue);

    if (oneValueSimple) {
      return {
        key,
        beforeValue,
        afterValue,
        status: nodeStatus.CHANGED,
      };
    }

    return {
      key,
      children: [...buildDiff(beforeValue, afterValue)],
    };
  });
};

export default buildDiff;
