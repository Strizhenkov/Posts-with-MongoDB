import express from 'express';
import {DatabaseConfigurator} from './steps/databaseConfigurator.ts';
import {SessionConfigurator} from './steps/sessionConfigurator.ts';
import {ViewConfigurator} from './steps/viewConfigurator.ts';
import {RouterConfigurator} from './steps/routerConfigurator.ts';
import {ServerStarter} from './steps/serverStarter.ts';
import {IServerStep} from './steps/iServerStep.ts';

export class ServerRunner {
    private _steps: IServerStep[];

    public constructor();

    public constructor(steps: IServerStep[]);

    public constructor(steps?: IServerStep[]) {
        this._steps = steps ?? [
            new DatabaseConfigurator(),
            new SessionConfigurator(),
            new ViewConfigurator(),
            new RouterConfigurator(),
            new ServerStarter()
        ];
    }

    public async run(): Promise<void> {
        const _app = express();

        for (let i = 0; i < this._steps.length; i++) {
            try {
                await this._steps[i].execute(_app, i);
            } catch (err) {
                process.exit(1);
            }
        }
    }
}