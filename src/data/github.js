import Cookies from 'js-cookie';

const githubAPIFetchOptions = {
  headers: {
    Authorization: `token ${Cookies.get('github-access-token')}`,
    Accept: 'application/vnd.github.black-cat-preview+json'
  }
};

export default {
  listPullRequests(repositoryInfo, page) {
    return {
      url: `https://api.github.com/repos/${repositoryInfo.user}/${repositoryInfo.repository}/pulls?state=all&page=${page}`,
      options: githubAPIFetchOptions
    };
  },
  listReviews(repositoryInfo, pullRequestNumber) {
    return {
      url: `https://api.github.com/repos/${repositoryInfo.user}/${repositoryInfo.repository}/pulls/${pullRequestNumber}/reviews`,
      options: githubAPIFetchOptions
    };
  }
};
