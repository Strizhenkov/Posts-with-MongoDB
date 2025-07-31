import express from 'express';
import {DatabaseConfigurator} from './steps/databaseConfigurator.ts';
import {SessionConfigurator} from './steps/sessionConfigurator.ts';
import {ViewConfigurator} from './steps/viewConfigurator.ts';
import {RouterConfigurator} from './steps/routerConfigurator.ts';
import {ServerStarter} from './steps/serverStarter.ts';

export class ServerRunner {
    async run() {
        const app = express();

        await new DatabaseConfigurator().configure();
        new SessionConfigurator().configure(app);
        new ViewConfigurator().configure(app);
        new RouterConfigurator().configure(app);
        new ServerStarter().start(app);
    }
}