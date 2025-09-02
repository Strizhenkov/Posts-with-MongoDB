import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';
import session from 'express-session';
import type {IServerStep} from './iServerStep.ts';
import type {AppConfig} from '../config/appConfig.ts';
import type {Express} from 'express';

dotenv.config();

declare module 'express-session' {
    interface SessionData {
        userId?: string;
    }
}

export class SessionConfigurator implements IServerStep {
    constructor(private config: AppConfig) {}

    public execute(app: Express, stepIndex: number): void {
        try {
            app.use(
                session({
                    secret: this.config.session.secret,
                    resave: false,
                    saveUninitialized: false,
                    store: MongoStore.create({mongoUrl: this.config.session.mongoUrl}),
                    cookie: {
                        httpOnly: this.config.session.cookie.httpOnly,
                        secure: this.config.session.cookie.secure,
                        maxAge: this.config.session.cookie.maxAgeMs
                    }
                })
            );
            console.log(`${stepIndex + 1}) Session configured successfully.`);
        } catch (err) {
            console.error(`${stepIndex + 1}) Session configuration failed:`, err);
            throw err;
        }
    }
}