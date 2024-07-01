import { build } from 'gluegun';

const cli = build()
  .brand('resource-generator')
  .src(__dirname)
  .plugins('./node_modules', {
    matching: 'resource-generator-*',
    hidden: true,
  })
  .help()
  .version()
  .create();

cli.run();
