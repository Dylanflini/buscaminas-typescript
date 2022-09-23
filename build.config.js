const serverConfig = {
  entryPoints: ['src/minesweeper/infrastructure/server/server'],
  bundle: true,
  platform: 'node',
  target: 'node14', //depend of the deploy server
  format: 'cjs',
  outdir: 'dist',
};

module.exports = {
  serverConfig,
};
