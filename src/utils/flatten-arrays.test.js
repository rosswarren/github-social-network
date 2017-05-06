const flattenArrays = require('./flatten-arrays').default;

test('flattens the arrays', () => {
  const flattened = flattenArrays([
    [
      1,
      2
    ],
    3,
    [
      4,
      5
    ]
  ]);

  expect(flattened).toEqual([
    1,
    2,
    3,
    4,
    5
  ]);
});
