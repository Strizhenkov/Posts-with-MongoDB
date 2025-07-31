import session from 'express-session';
import MongoStore from 'connect-mongo';
import {Express} from 'express';
import dotenv from 'dotenv';

dotenv.config();

declare module 'express-session' {
    interface SessionData {
        userId?: string;
    }
}

export class SessionConfigurator {
    configure(app: Express) {
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
            console.log("2) Session configured successfully.");
        } catch (err) {
            console.error("2) Session configuration failed:", err);
            throw err;
        }
    }
}