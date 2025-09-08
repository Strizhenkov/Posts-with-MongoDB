import dotenv from 'dotenv';

dotenv.config();

export enum ComparatorType {
    MyComparator = 'myComparator',
    ImportedComparator ='importedComparator'
}

enum NodeStateEnv {
    Development = 'development',
    Production = 'production',
    Test = 'test'
}

function parseNodeEnv(value?: string): NodeStateEnv {
    switch (value) {
    case NodeStateEnv.Production:
        return NodeStateEnv.Production;
    case NodeStateEnv.Test:
        return NodeStateEnv.Test;
    default:
        return NodeStateEnv.Development;
    }
}

export type AppConfig = {
    port: number;
    nodeEnv: NodeStateEnv;
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
    comparator: ComparatorType;
};

function envComparator(): ComparatorType {
    const raw = (process.env.DIFF_COMPARATOR ?? 'myComparator');
    return raw === 'myComparator' ? ComparatorType.MyComparator : ComparatorType.ImportedComparator;
}

function required(name: string, val?: string): string {
    if (!val) {
        throw new Error(`Missing required env: ${name}`);
    }
    return val;
}

export function loadConfig(): AppConfig {
    const nodeEnv = parseNodeEnv(process.env.NODE_ENV);

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
                secure: nodeEnv === NodeStateEnv.Production,
                maxAgeMs: 1000 * 60 * 60
            }
        },

        comparator: envComparator()
    };

    return config;
}