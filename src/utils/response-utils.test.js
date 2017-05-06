const { json, validateStatus } = require('./response-utils');

function FakeResponse(body) {
  return {
    json() {
      return Promise.resolve(
        JSON.parse(body)
      );
    }
  };
}

test('parses the json', () => json(FakeResponse('{"a":3}')).then((body) => {
  expect(body).toEqual({
    a: 3
  });
}));

test('returns the result when response code is 200', () => {
  expect(validateStatus({
    status: 200
  })).toEqual({
    status: 200
  });
});

test('throws an error when the status is something else', () => {
  expect(() => validateStatus({
    status: 500
  })).toThrow('non 200 status');
});
