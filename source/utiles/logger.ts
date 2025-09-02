import fs from 'fs';
import path from 'path';

export interface LoggerStrategy {
    log(message: string): void;
    error(message: string, err?: unknown): void;
}

export class ConsoleLoggerStrategy implements LoggerStrategy {
    public log(message: string): void {
        console.log(`[LOG] ${message}`);
    }

    public error(message: string, err?: unknown): void {
        console.error(`[ERROR] ${message}`, err);
    }
}

export class FileLoggerStrategy implements LoggerStrategy {
    private logFile: string;

    constructor(filePath: string = './logs/app.log') {
        this.logFile = path.resolve(filePath);
        fs.mkdirSync(path.dirname(this.logFile), {recursive: true});
    }

    public log(message: string): void {
        this.write(`[LOG] ${message}`);
    }

    public error(message: string, err?: unknown): void {
        this.write(`[ERROR] ${message} ${err instanceof Error ? err.stack : String(err)}`);
    }

    private write(line: string): void {
        const timestamp = new Date().toISOString();
        fs.appendFileSync(this.logFile, `${timestamp} ${line}\n`);
    }
}

export class Logger {
    private strategy: LoggerStrategy;

    constructor(strategy: LoggerStrategy) {
        this.strategy = strategy;
    }

    public setStrategy(strategy: LoggerStrategy): void {
        this.strategy = strategy;
    }

    public log(message: string): void {
        this.strategy.log(message);
    }

    public error(message: string, err?: unknown): void {
        this.strategy.error(message, err);
    }
}