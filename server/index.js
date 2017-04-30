const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const config = require('./config');

const app = express();
app.use(cookieParser());

const githubOAuth = require('github-oauth')({
  githubClient: config.GITHUB_KEY,
  githubSecret: config.GITHUB_SECRET,
  baseURL: config.GITHUB_REDIRECT_URL,
  loginURI: '/auth/github',
  callbackURI: '/auth/github/callback',
  scope: 'repo'
});

app.use(express.static(`${__dirname}/build`));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

app.get('/auth/github', (req, res) => githubOAuth.login(req, res));

app.get('/auth/github/callback', (req, res) => githubOAuth.callback(req, res, (error, result) => {
  res.cookie('github-access-token', result.access_token, {
    path: '/',
    maxAge: 900000
  });
  res.redirect('/');
}));

githubOAuth.on('error', (err) => {
  console.error('there was a login error', err);
});

githubOAuth.on('token', (token, serverResponse) => {
  serverResponse.end(JSON.stringify(token));
});

const server = app.listen(config.PORT, () => {
  console.log('Listening on port %d', server.address().port);
});
