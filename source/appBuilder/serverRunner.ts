import express from 'express';
import {DatabaseConfigurator} from './steps/databaseConfigurator.ts';
import {RouterConfigurator} from './steps/routerConfigurator.ts';
import {ServerStarter} from './steps/serverStarter.ts';
import {SessionConfigurator} from './steps/sessionConfigurator.ts';
import {ViewConfigurator} from './steps/viewConfigurator.ts';
import type {IServerStep} from './steps/iServerStep.ts';

export class ServerRunner {
    private _steps: IServerStep[];

    constructor();

    constructor(steps: IServerStep[]);

    constructor(steps?: IServerStep[]) {
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
                console.error(err);
                process.exit(1);
            }
        }
    }
}