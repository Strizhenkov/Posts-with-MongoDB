
import type {ErrorHandler} from '../errorHandler.ts';
import type {IValidationStep} from './iValidationStep.ts';
import type {Response} from 'express';

export class AuthenticatedCheck implements IValidationStep {
    constructor(private userId: string | undefined | null) {}

    public async execute(res: Response, route: string, errorHandler: ErrorHandler): Promise<boolean> {
        if (!this.userId) {
            errorHandler.handle(res, 401, route, 'Not authenticated');
            return false;
        }
        return true;
    }
}