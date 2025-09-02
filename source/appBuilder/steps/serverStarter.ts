import fs from 'fs';
import http from 'http';
import https from 'https';
import dotenv from 'dotenv';
import type {IServerStep} from './iServerStep.ts';
import type {Logger} from '../../utiles/logger.ts';
import type {AppConfig} from '../config/appConfig.ts';
import type {Express} from 'express';

dotenv.config();

export class ServerStarter implements IServerStep  {
    constructor(private config: AppConfig) {}

    public execute(app: Express, stepIndex: number, stepLogger: Logger): void {
        try {
            const {port, https: httpsCfg} = this.config;
            if (httpsCfg.enabled) {
                const key = fs.readFileSync(httpsCfg.keyPath);
                const cert = fs.readFileSync(httpsCfg.certPath);

                https.createServer({key, cert}, app).listen(port, () => {
                    stepLogger.log(`${stepIndex + 1}) Server running at https://localhost:${port}`);
                });
            } else {
                http.createServer(app).listen(port, () => {
                    stepLogger.log(`${stepIndex + 1}) Server running at http://localhost:${port}`);
                });
            }
        } catch (err) {
            stepLogger.error(`${stepIndex + 1}) Server startup failed:`, err);
            throw err;
        }
    }
}