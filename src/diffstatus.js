export const STATUS = {
  REMOVED: 'removed',
  UNCHANGED: 'unchanged',
  CHANGED: 'changed',
  ADDED: 'added',
};

const statusSymbols = {
  [STATUS.ADDED]: '+',
  [STATUS.REMOVED]: '-',
  [STATUS.UNCHANGED]: ' ',
};

export const getStatusSymbol = (status) => {
  const symbol = statusSymbols[status];

  if (symbol === undefined) {
    throw new Error(`Cant found symbol for status ${status} `);
  }

  return symbol;
};
