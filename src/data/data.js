import parseLinkHeader from 'parse-link-header';

import github from './github';
import cache from './cache';

function validateStatus(response) {
  if (response.status !== 200) {
    throw new Error('non 200 status');
  }

  return response;
}

function json(response) {
  return response.json();
}

function get({ url, options }, mapper) {
  if (cache.getValue(url)) {
    return Promise.resolve(JSON.parse(cache.getValue(url)));
  }

  return fetch(url, options)
    .then(validateStatus)
    .then(json)
    .then((data) => {
      const mappedData = mapper(data);
      cache.setValue(url, JSON.stringify(mappedData));
      return mappedData;
    });
}

function flattenArrays(arrays) {
  return arrays.reduce((a, b) => a.concat(b));
}

function range(i) {
  return Array(i).fill();
}

function mapReviewsResponse(response) {
  return response.map(review => ({
    state: review.state,
    user: review.user.login
  }));
}

function mapPullRequestResponse(response) {
  return response.map(pr => ({
    user: pr.user.login,
    number: pr.number
  }));
}

function getPullRequests(repositoryInfo, limit) {
  const listPullRequests = github.listPullRequests(repositoryInfo, 1);

  return fetch(listPullRequests.url, listPullRequests.options)
    .then(validateStatus)
    .then((firstPageResponse) => {
      const lastPage = parseLinkHeader(firstPageResponse.headers.get('Link')).last.page;

      let pagesToFetch = lastPage - 1;

      if (pagesToFetch > limit) {
        pagesToFetch = limit;
      }

      return Promise.all([
        firstPageResponse.json().then(mapPullRequestResponse),
        ...range(pagesToFetch).map((_, i) => get(
          github.listPullRequests(repositoryInfo, i + 1),
          mapPullRequestResponse
        ))
      ])
        .then(flattenArrays);
    });
}

export default function getData(repositoryInfo, limit) {
  const result = {
    users: [],
    reviews: []
  };

  return getPullRequests(repositoryInfo, limit).then(pullRequests => Promise.all(
    pullRequests.map(
      (pr) => {
        if (result.users.indexOf(pr.user) === -1) {
          result.users.push(pr.user);
        }

        return pr;
      }
    ).map(
      pr => get(github.listReviews(repositoryInfo, pr.number), mapReviewsResponse)
        .then(reviews => reviews
          .filter(rv => rv.state === 'APPROVED' || rv.state === 'CHANGES_REQUESTED')
          .map((review) => {
            if (result.users.indexOf(review.user) === -1) {
              result.users.push(review.user);
            }

            const matchesUsers = rv => rv.from === review.user && rv.to === pr.user;

            const existingLink = result.reviews.find(matchesUsers);

            if (existingLink) {
              existingLink.value += 1;
            } else {
              result.reviews.push({
                from: review.user,
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
