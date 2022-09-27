const serverConfig = {
  entryPoints: ['src/minesweeper/infrastructure/server/server'],
  bundle: true,
  platform: 'node',
  target: 'node14', //depend of the deploy server
  format: 'cjs',
  outfile: 'dist/index.js',
};

module.exports = {
  serverConfig,
};
