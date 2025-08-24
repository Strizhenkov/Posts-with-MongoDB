import fs from 'fs';
import https from 'https';
import dotenv from 'dotenv';
import type {IServerStep} from './iServerStep.ts';
import type {Express} from 'express';

dotenv.config();

export class ServerStarter implements IServerStep  {
    public execute(app: Express, stepIndex: number): void {
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