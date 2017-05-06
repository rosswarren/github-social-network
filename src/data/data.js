import parseLinkHeader from 'parse-link-header';

import range from '../utils/range';
import flattenArrays from '../utils/flatten-arrays';

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
        ...range(pagesToFetch).map(i => get(
          github.listPullRequests(repositoryInfo, i + 1),
          mapPullRequestResponse
        ))
      ])
        .then(flattenArrays);
    });
}

export function getData(repositoryInfo, limit) {
  const result = {
    users: [],
    reviews: []
  };

  return getPullRequests(repositoryInfo, limit).then(pullRequests => Promise.all(
    pullRequests.map(
      (pr) => {
        if (!result.users.find(user => user.name === pr.user)) {
          result.users.push({ name: pr.user, value: 0 });
        }

        return pr;
      }
    ).map(
      pr => get(github.listReviews(repositoryInfo, pr.number), mapReviewsResponse)
        .then(reviews => reviews
          .map((review) => {
            if (!result.users.find(user => user.name === review.user)) {
              result.users.push({ name: review.user, value: 0 });
            }

            result.reviews.push({
              from: review.user,
              to: pr.user,
              state: review.state
            });

            return result;
          })
        )
    )
  )).then(() => result);
}

function applyStateFilters(stateFilters) {
  const allowedStates = [
    stateFilters.approvals && 'APPROVED',
    stateFilters.requestedChanges && 'CHANGES_REQUESTED',
    stateFilters.comments && 'COMMENTED'
  ].filter(Boolean);

  return review => allowedStates.indexOf(review.state) !== -1;
}

export function calculateResults({ users, reviews }, stateFilters) {
  const resultUsers = users.map(user => ({
    ...user
  }));

  const reducedReviews = reviews
    .filter(applyStateFilters(stateFilters))
    .filter(review => review.from !== review.to)
    .reduce((acc, review) => {
      const existingReview = acc.find(rv => rv.from === review.from && rv.to === review.to);

      if (resultUsers.find(user => user.name === review.from)) {
        resultUsers.find(user => user.name === review.from).value += 1;
      } else {
        resultUsers.push({
          name: review.from,
          value: 1
        });
      }

      if (existingReview) {
        existingReview.value += 1;
      } else {
        acc.push({
          from: review.from,
          to: review.to,
          value: 1
        });
      }

      return acc;
    }, []);

  return {
    users: resultUsers,
    reviews: reducedReviews
  };
}
