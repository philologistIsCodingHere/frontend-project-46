import _ from 'lodash';

const REPLACER = '  ';
const ADDED = '+';
const REMOVE = '-';
const LINE_BREAK = '\n';

const makeIndent = (depth) => REPLACER.repeat(2 * depth - 1);

const stringify = (data, depth) => {
  if (!_.isObject(data)) {
    return data;
  }
  const result = Object.entries(data).map(([key, value]) => `${makeIndent(depth + 1)}  ${key}: ${stringify(value, depth + 1)}`);
  return `{${LINE_BREAK}${result.join(LINE_BREAK)}${LINE_BREAK}${makeIndent(depth)}  }`;
};

const getString = (key, value, depth, symbol = ' ') => `${makeIndent(depth)}${symbol} ${key}: ${stringify(value, depth)}`;

const getStylish = (data) => {
  const iter = (nodes, depth) => nodes.map(({ key, type, value }) => {
    switch (type) {
      case 'nested':
        return [
          `${makeIndent(depth)}  ${key}: {`,
          iter(value, depth + 1),
          `${makeIndent(depth)}  }`,
        ];
      case 'added':
        return getString(key, value, depth, ADDED);
      case 'removed':
        return getString(key, value, depth, REMOVE);
      case 'changed':
        return [
          `${getString(key, value[0], depth, REMOVE)}`,
          `${getString(key, value[1], depth, ADDED)}`,
        ].join(LINE_BREAK);
      default:
        return getString(key, value, depth);
    }
  });
  const result = iter(data, 1).flat(Infinity);
  return `{${LINE_BREAK}${result.join(LINE_BREAK)}${LINE_BREAK}}`;
};

export default getStylish;
