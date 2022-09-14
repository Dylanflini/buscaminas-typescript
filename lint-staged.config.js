module.exports = {
    '**/*.(ts|tsx)': filenames => [`eslint --fix ${filenames.join(' ')}`],
  };