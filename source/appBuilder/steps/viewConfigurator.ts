import express, {Express} from 'express';
import {IServerStep} from './iServerStep.ts';

export class ViewConfigurator implements IServerStep  {
    execute(app: Express, stepIndex: number): void {
        try {
            app.use(express.json());
            app.use(express.urlencoded({extended: true}));
            app.set('views', './source/views');
            app.set('view engine', 'ejs');
            app.use(express.static('./source/static'));
            console.log(`${stepIndex + 1}) View engine and static files configured successfully.`);
        } catch (err) {
            console.error(`${stepIndex + 1}) View configuration failed:`, err);
            throw err;
        }
    }
}