const { build } = require('esbuild');
const { watch } = require('chokidar');
const { exec } = require('child_process');
const { config } = require('dotenv');
const { serverConfig } = require('./build.config');

config();

async function main() {
  const serverBuilder = await build({
    ...serverConfig,
    incremental: true,
    minify: false,
  });

  watch(['src/.'], { interval: 0 })
    .on('change', () => {
      console.log('re building');
      serverBuilder.rebuild();
    })
    .on('ready', async () => {
      try {
        console.log('ready');

        const nodemonExec = exec('nodemon --watch dist dist/index.js');

        nodemonExec.stdout.on('data', data => {
          console.log(data);
        });

        nodemonExec.stderr.on('data', data => {
          console.error(data);
        });
      } catch (error) {
        console.error(error);
      }
    });
}

main();
