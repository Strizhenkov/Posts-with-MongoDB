import {Response} from "express";
import {ErrorHandler} from "../errorHandler.ts";
import {IValidationStep} from "./iValidationStep.ts";
import {UserDBUnit} from "../../model/dbUnits/userUnit.ts";

export class PasswordMatchCheck implements IValidationStep {
    public constructor(private username: string, private password: string) {}

    public async execute(res: Response, route: string, errorHandler: ErrorHandler): Promise<boolean> {
        const user = await UserDBUnit.findByUsername(this.username);
        
        if (!user || !(await user.comparePassword(this.password))) {
            errorHandler.handle(res, 400, route, "Wrong username or password");
            return false;
        }
        return true;
    }
}