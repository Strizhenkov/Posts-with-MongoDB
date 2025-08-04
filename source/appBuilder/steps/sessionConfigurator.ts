import session from 'express-session';
import MongoStore from 'connect-mongo';
import {Express} from 'express';
import dotenv from 'dotenv';
import {IServerStep} from './iServerStep.ts';

dotenv.config();

declare module 'express-session' {
    interface SessionData {
        userId?: string;
    }
}

export class SessionConfigurator implements IServerStep {
    execute(app: Express, stepIndex: number): void {
        try {
            app.use(session({
                secret: process.env.SESSION_SECRET as string,
                resave: false,
                saveUninitialized: false,
                store: MongoStore.create({mongoUrl: process.env.MONGO_URI}),
                cookie: {
                    httpOnly: true,
                    secure: true,
                    maxAge: 1000 * 60 * 60
                }
            }));
            console.log(`${stepIndex + 1}) Session configured successfully.`);
        } catch (err) {
            console.error(`${stepIndex + 1}) Session configuration failed:`, err);
            throw err;
        }
    }
}