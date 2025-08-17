import {Response} from "express";
import {ErrorHandler} from "../errorHandler.ts";
import {IValidationStep} from "./iValidationStep.ts";
import {UserDBUnit} from "../../model/dbUnits/userUnit.ts";
import {IUser} from "../../model/entities/user.ts";

export class UserRoleValidCheck implements IValidationStep {
    public constructor(private userId: string, private requiredRole: string) {}

    public async execute(res: Response, route: string, errorHandler: ErrorHandler): Promise<boolean> {
        const user = await UserDBUnit.findById(this.userId) as IUser;
        
        if (user.role !== this.requiredRole) {
            errorHandler.handle(res, 403, route, `User is not an ${this.requiredRole}`);
            return false;
        }
        return true;
    }
}