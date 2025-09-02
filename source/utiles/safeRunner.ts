import {ErrorHandler} from './errorHandler.ts';
import type {Logger} from './logger.ts';
import type {Response} from 'express';

export class SafeRunner {
    private _errorHandler = new ErrorHandler(this.logger);

    constructor(private res: Response, private route: string, private logger : Logger) {}

    public async safeExecute<T>(action: () => Promise<T>): Promise<T | void> {
        try {
            return await action();
        } catch (err: unknown) {
            if (err instanceof Error) {
                this._errorHandler.handle(this.res, 500, this.route, err.message);
            } else {
                this._errorHandler.handle(this.res, 500, this.route, 'Unknown error');
            }
        }
    }
}