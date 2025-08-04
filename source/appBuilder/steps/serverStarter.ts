import fs from 'fs';
import https from 'https';
import {Express} from 'express';
import dotenv from 'dotenv';
import {IServerStep} from './iServerStep.ts';

dotenv.config();

export class ServerStarter implements IServerStep  {
    execute(app: Express, stepIndex: number): void {
        try {
            const PORT = process.env.Port || 3000;
            https.createServer({
                key: fs.readFileSync('./artifacts/cert/key.pem'),
                cert: fs.readFileSync('./artifacts/cert/cert.pem')
            }, app).listen(PORT, () => {
                console.log(`${stepIndex + 1}) Server running at https://localhost:${process.env.PORT}.`);
            });
        } catch (err) {
            console.error(`${stepIndex + 1}) Server startup failed:`, err);
            throw err;
        }     
    }
}