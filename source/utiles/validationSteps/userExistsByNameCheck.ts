import {Response} from "express";
import {ErrorHandler} from "../errorHandler.ts";
import {IValidationStep} from "./iValidationStep.ts";
import User from "../../model/entities/user.ts";

export class UserExistsByNameCheck implements IValidationStep {
    constructor(private username: string | undefined | null) {}

    async execute(res: Response, route: string, errorHandler: ErrorHandler): Promise<boolean> {
        const user = await User.findOne({username: this.username});
        if (!user) {
            errorHandler.handle(res, 404, route, "User not found");
            return false;
        }
        return true;
    }
}