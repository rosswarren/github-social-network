
const githubAPIFetchOptions = {
  headers: {
    Authorization: 'token df11df6ca1d562568a5127cae0c8182b4a48ed88',
    Accept: 'application/vnd.github.black-cat-preview+json'
  }
};

function validateStatus(response) {
  if (response.status !== 200) {
    throw new Error('non 200 status');
  }

  return response;
}

function json(response) {
  return response.json();
}

function get(url) {
  return fetch(url, githubAPIFetchOptions).then(validateStatus).then(json);
}

function buildListPullRequestsUrl(repositoryInfo, page) {
  return `https://api.github.com/repos/${repositoryInfo.user}/${repositoryInfo.repository}/pulls?state=all&page=${page}`;
}

function buildReviewsUrl(repositoryInfo, pullRequestNumber) {
  return `https://api.github.com/repos/${repositoryInfo.user}/${repositoryInfo.repository}/pulls/${pullRequestNumber}/reviews`;
}

function getPullRequests(repositoryInfo) {
  return Promise.all([
    get(buildListPullRequestsUrl(repositoryInfo, 1)),
    get(buildListPullRequestsUrl(repositoryInfo, 2)),
    get(buildListPullRequestsUrl(repositoryInfo, 3)),
    get(buildListPullRequestsUrl(repositoryInfo, 4)),
    get(buildListPullRequestsUrl(repositoryInfo, 5))
  ]).then(pullRequestArrays => pullRequestArrays.reduce((a, b) => a.concat(b)))
  .then(response => response.map(pr => ({
    user: pr.user.login,
    number: pr.number
  })));
}

export default function getData(repositoryInfo) {
  const result = {
    users: [],
    reviews: []
  };

  return getPullRequests().then(pullRequests => Promise.all(
    pullRequests.map(
      pr => get(buildReviewsUrl(repositoryInfo, pr.number))
        .then(reviews => reviews
          .filter(rv => rv.state === 'APPROVED')
          .map((review) => {
            if (result.users.indexOf(review.user.login) === -1) {
              result.users.push(review.user.login);
            }

            const matchesUsers = rv => rv.from === review.user.login && rv.to === pr.user;

            const existingLink = result.reviews.find(matchesUsers);

            if (existingLink) {
              existingLink.value += 1;
            } else {
              result.reviews.push({
                from: review.user.login,
                to: pr.user,
                value: 1
              });
            }

            return result;
          })
        )
    )
  )).then(() => result);
}
