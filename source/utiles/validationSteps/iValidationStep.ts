import type {ErrorHandler} from '../errorHandler.ts';
import type {Response} from 'express';

export interface IValidationStep {
    execute(res: Response, route: string, errorHandler: ErrorHandler): Promise<boolean>;
}