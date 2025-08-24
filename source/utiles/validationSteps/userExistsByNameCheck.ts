import {UserDBUnit} from '../../model/dbUnits/userUnit.ts';
import type {ErrorHandler} from '../errorHandler.ts';
import type {IValidationStep} from './iValidationStep.ts';
import type {Response} from 'express';

export class UserExistsByNameCheck implements IValidationStep {
    constructor(private username: string) {}

    public async execute(res: Response, route: string, errorHandler: ErrorHandler): Promise<boolean> {
        const user = await UserDBUnit.findByUsername(this.username);

        if (!user) {
            errorHandler.handle(res, 404, route, 'User not found');
            return false;
        }
        return true;
    }
}