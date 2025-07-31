import fs from 'fs';
import https from 'https';
import {Express} from 'express';
import dotenv from 'dotenv';

dotenv.config();

export class ServerStarter {
    start(app: Express) {
        try {
            const PORT = process.env.Port || 3000;
            https.createServer({
                key: fs.readFileSync('./artifacts/cert/key.pem'),
                cert: fs.readFileSync('./artifacts/cert/cert.pem')
            }, app).listen(PORT, () => {
                console.log(`5) Server running at https://localhost:${process.env.PORT}.`);
            });
        } catch (err) {
            console.error("5) Server startup failed:", err);
            throw err;
        }     
    }
}