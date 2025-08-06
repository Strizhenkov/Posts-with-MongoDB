import {Response} from "express";
import {ErrorHandler} from "../errorHandler.ts";
import {IValidationStep} from "./iValidationStep.ts";
import User from "../../model/entities/user.ts";

export class UserRoleValidCheck implements IValidationStep {
    constructor(private userId: string | undefined | null, private requiredRole: string) {}

    async execute(res: Response, route: string, errorHandler: ErrorHandler): Promise<boolean> {
        const user = await User.findById(this.userId);
        if (!user) {
            errorHandler.handle(res, 404, route, "User not found");
            return false;
        }
        if (user.role !== this.requiredRole) {
            errorHandler.handle(res, 403, route, `User is not an ${this.requiredRole}`);
            return false;
        }
        return true;
    }
}