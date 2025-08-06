import {Response} from "express";
import {ErrorHandler} from "../errorHandler.ts";
import {IValidationStep} from "./iValidationStep.ts";
import User from "../../model/entities/user.ts";

export class UserExistsByIdCheck implements IValidationStep {
    constructor(private userId: string | undefined | null) {}

    async execute(res: Response, route: string, errorHandler: ErrorHandler): Promise<boolean> {
        const user = await User.findById(this.userId);
        if (!user) {
            errorHandler.handle(res, 404, route, "User not found");
            return false;
        }
        return true;
    }
}