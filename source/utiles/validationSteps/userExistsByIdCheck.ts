import {UserDBUnit} from '../../model/dbUnits/userUnit.ts';
import type {ErrorHandler} from '../errorHandler.ts';
import type {IValidationStep} from './iValidationStep.ts';
import type {Response} from 'express';

export class UserExistsByIdCheck implements IValidationStep {
    constructor(private userId: string | undefined) {}

    public async execute(res: Response, route: string, errorHandler: ErrorHandler): Promise<boolean> {
        if (this.userId == undefined) {
            errorHandler.handle(res, 400, route, 'Uncorrect userId');
            return false;
        }

        const user = await UserDBUnit.findById(this.userId);

        if (!user) {
            errorHandler.handle(res, 404, route, 'User not found');
            return false;
        }
        return true;
    }
}