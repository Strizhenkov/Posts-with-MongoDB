import {ServerRunner} from './appBuilder/serverRunner.ts';

(async () => {
    const runner = new ServerRunner();
    await runner.run();
})();