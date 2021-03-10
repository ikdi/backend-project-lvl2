import _ from 'lodash';

const buildDiff = (data1, data2) => {
  const keys = _.union(Object.keys(data1), Object.keys(data2));
  return keys.map((key) => {
    const beforeValue = data1[key];
    const afterValue = data2[key];

    if (!_.has(data1, key)) {
      return {
        key,
        type: 'added',
        beforeValue,
        afterValue,
      };
    }

    if (!(_.has(data2, key))) {
      return {
        key,
        type: 'removed',
        beforeValue,
        afterValue,
      };
    }

    if (_.isPlainObject(beforeValue) && _.isPlainObject(afterValue)) {
      return {
        key,
        type: 'nested',
        children: buildDiff(beforeValue, afterValue),
      };
    }

    const type = beforeValue === afterValue ? 'unchanged' : 'changed';

    return {
      key, beforeValue, afterValue, type,
    };
  });
};

export default buildDiff;
