import {Response} from 'express';
import {ErrorHandler} from './errorHandler.ts';

export class SafeRunner {
    private _errorHandler = new ErrorHandler();

    public constructor(private res: Response, private route: string) {}

    public async safeExecute<T>(action: () => Promise<T>): Promise<T | void> {
        try {
            return await action();
        } catch (err: any) {
            this._errorHandler.handle(this.res, 500, this.route, err.message);
        }
    }
}