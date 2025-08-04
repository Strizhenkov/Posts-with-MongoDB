import express from 'express';
import {DatabaseConfigurator} from './steps/databaseConfigurator.ts';
import {SessionConfigurator} from './steps/sessionConfigurator.ts';
import {ViewConfigurator} from './steps/viewConfigurator.ts';
import {RouterConfigurator} from './steps/routerConfigurator.ts';
import {ServerStarter} from './steps/serverStarter.ts';
import {IServerStep} from './steps/iServerStep.ts';

export class ServerRunner {
    private steps: IServerStep[];

    constructor();

    constructor(steps: IServerStep[]);

    constructor(steps?: IServerStep[]) {
        this.steps = steps ?? [
            new DatabaseConfigurator(),
            new SessionConfigurator(),
            new ViewConfigurator(),
            new RouterConfigurator(),
            new ServerStarter()
        ];
    }

    async run(): Promise<void> {
        const app = express();

        for (let i = 0; i < this.steps.length; i++) {
            try {
                await this.steps[i].execute(app, i);
            } catch (err) {
                process.exit(1);
            }
        }
    }
}