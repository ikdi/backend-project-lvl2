import _ from 'lodash';

const buildDiff = (data1, data2) => {
  const keys = _.union(Object.keys(data1), Object.keys(data2));

  return _.sortBy(keys).map((key) => {
    const beforeValue = data1[key];
    const afterValue = data2[key];

    if (!_.has(data1, key)) {
      return {
        key, type: 'added', beforeValue, afterValue,
      };
    }

    if (!(_.has(data2, key))) {
      return {
        key, type: 'removed', beforeValue, afterValue,
      };
    }

    if (_.isPlainObject(beforeValue) && _.isPlainObject(afterValue)) {
      return {
        key, type: 'nested', children: buildDiff(beforeValue, afterValue),
      };
    }

    if (beforeValue !== afterValue) {
      return {
        key, type: 'changed', beforeValue, afterValue,
      };
    }

    return {
      key, type: 'unchanged', beforeValue, afterValue,
    };
  });

  // return _.sortBy(diff, 'key');
};

export default buildDiff;
