import {ServerRunner} from './appBuilder/serverRunner.ts';

(async () => {
    const runner = new ServerRunner().defaultSetUp();
    await runner.run();
})();