jest.setMock('js-cookie', {
  get(cookieName) {
    if (cookieName === 'github-access-token') {
      return '1234';
    }
    throw new Error('unrecognised cookie name');
  }
});

const github = require('./github').default;

test('returns the url and options to list pull requests for a given repository and page', () => {
  const { url, options } = github.listPullRequests({
    user: 'facebook',
    repository: 'react'
  }, 1);

  expect(url).toBe('https://api.github.com/repos/facebook/react/pulls?state=all&page=1');
  expect(options).toEqual({
    headers: {
      Accept: 'application/vnd.github.black-cat-preview+json',
      Authorization: 'token 1234'
    }
  });
});

test('returns the url and options to list reviews for a given pull request', () => {
  const { url, options } = github.listReviews({
    user: 'facebook',
    repository: 'react'
  }, 98);

  expect(url).toBe('https://api.github.com/repos/facebook/react/pulls/98/reviews');
  expect(options).toEqual({
    headers: {
      Accept: 'application/vnd.github.black-cat-preview+json',
      Authorization: 'token 1234'
    }
  });
});
