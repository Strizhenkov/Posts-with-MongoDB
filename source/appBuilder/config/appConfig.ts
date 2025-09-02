import dotenv from 'dotenv';

dotenv.config();

export type AppConfig = {
    port: number;
    nodeEnv: 'development' | 'production' | 'test';
    https: {
        enabled: boolean;
        keyPath: string;
        certPath: string;
    };

    session: {
        secret: string;
        mongoUrl: string;
        cookie: {
            httpOnly: boolean;
            secure: boolean;
            maxAgeMs: number;
        };
    };
};

function required(name: string, val?: string): string {
    if (!val) {throw new Error(`Missing required env: ${name}`);}
    return val;
}

export function loadConfig(): AppConfig {
    const nodeEnv = (process.env.NODE_ENV ?? 'development') as AppConfig['nodeEnv'];

    const portStr = process.env.PORT;
    const port = Number(portStr);
    if (!Number.isInteger(port) || port <= 0) {
        throw new Error(`Invalid PORT env: "${portStr}"`);
    }

    const httpsEnabled = process.env.HTTPS_ENABLED!.toLowerCase() === 'true';

    const config: AppConfig = {
        port,
        nodeEnv,
        https: {
            enabled: httpsEnabled,
            keyPath: './artifacts/cert/key.pem',
            certPath: './artifacts/cert/cert.pem'
        },

        session: {
            secret: required('SESSION_SECRET', process.env.SESSION_SECRET),
            mongoUrl: required('MONGO_URI', process.env.MONGO_URI),
            cookie: {
                httpOnly: true,
                secure: nodeEnv === 'production',
                maxAgeMs: 1000 * 60 * 60
            }
        }
    };

    return config;
}