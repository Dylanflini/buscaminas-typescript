const { build } = require('esbuild');
const { serverConfig } = require('./build.config');

async function main() {
  await build({
    ...serverConfig,
    minify: true,
    logLevel: 'info',
  });
}

main();
