import {Response} from "express";
import {ErrorHandler} from "../errorHandler.ts";
import {IValidationStep} from "./iValidationStep.ts";
import {UserDBUnit} from "../../model/dbUnits/userUnit.ts";

export class UserExistsByNameCheck implements IValidationStep {
    public constructor(private username: string) {}

    public async execute(res: Response, route: string, errorHandler: ErrorHandler): Promise<boolean> {
        const user = await UserDBUnit.findByUsername(this.username);
        if (!user) {
            errorHandler.handle(res, 404, route, "User not found");
            return false;
        }
        return true;
    }
}