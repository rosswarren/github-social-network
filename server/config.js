function throwIfMissing(x, message) {
  if (!x) {
    throw new Error(message);
  }

  return x;
}

module.exports = {
  PORT: throwIfMissing(process.env.PORT, 'process.env.PORT missing'),
  GITHUB_REDIRECT_URL: throwIfMissing(process.env.GITHUB_REDIRECT_URL, 'process.env.GITHUB_REDIRECT_URL missing'),
  GITHUB_KEY: throwIfMissing(process.env.GITHUB_KEY, 'process.env.GITHUB_KEY missing'),
  GITHUB_SECRET: throwIfMissing(process.env.GITHUB_SECRET, 'process.env.GITHUB_SECRET'),
};
