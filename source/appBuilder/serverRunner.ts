import express from 'express';
import {ConsoleLoggerStrategy, Logger} from '../utiles/logger.ts';
import {loadConfig} from './config/appConfig.ts';
import {DatabaseConfigurator} from './steps/databaseConfigurator.ts';
import {RouterConfigurator} from './steps/routerConfigurator.ts';
import {ServerStarter} from './steps/serverStarter.ts';
import {SessionConfigurator} from './steps/sessionConfigurator.ts';
import {ViewConfigurator} from './steps/viewConfigurator.ts';
import type {IServerStep} from './steps/iServerStep.ts';

export class ServerRunner {
    private _steps: IServerStep[] = [];
    private _config = loadConfig();
    private _serverStartLogger = new Logger(new ConsoleLoggerStrategy());
    private _serverUseLogger = new Logger(new ConsoleLoggerStrategy());

    public addStep(step: IServerStep): ServerRunner {
        this._steps.push(step);
        return this;
    }

    public defaultSetUp(): ServerRunner {
        this.addStep(new DatabaseConfigurator)
            .addStep(new SessionConfigurator(this._config))
            .addStep(new ViewConfigurator)
            .addStep(new RouterConfigurator(this._serverUseLogger))
            .addStep(new ServerStarter(this._config));
        return this;
    }

    public async run(): Promise<void> {
        const _app = express();

        for (let i = 0; i < this._steps.length; i++) {
            try {
                await this._steps[i].execute(_app, i, this._serverStartLogger);
            } catch (err) {
                console.error(err);
                process.exit(1);
            }
        }
    }
}