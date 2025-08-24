import {UserDBUnit} from '../../model/dbUnits/userUnit.ts';
import type {ErrorHandler} from '../errorHandler.ts';
import type {IValidationStep} from './iValidationStep.ts';
import type {IUser} from '../../model/entities/user.ts';
import type {Response} from 'express';

export class UserRoleValidCheck implements IValidationStep {
    constructor(private userId: string, private requiredRole: string) {}

    public async execute(res: Response, route: string, errorHandler: ErrorHandler): Promise<boolean> {
        const user = await UserDBUnit.findById(this.userId) as IUser;

        if (user.role !== this.requiredRole) {
            errorHandler.handle(res, 403, route, `User is not an ${this.requiredRole}`);
            return false;
        }
        return true;
    }
}