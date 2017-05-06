const range = require('./range').default;

test('returns a range of numbers', () => {
  const rangeOfNumbers = range(11);

  expect(rangeOfNumbers).toEqual([
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10
  ]);
});
