import {Response} from "express";
import {ErrorHandler} from "../errorHandler.ts";
import {IValidationStep} from "./iValidationStep.ts";

export class AuthenticatedCheck implements IValidationStep {
    constructor(private userId: string | undefined | null) {}

    async execute(res: Response, route: string, errorHandler: ErrorHandler): Promise<boolean> {
        if (!this.userId) {
            errorHandler.handle(res, 401, route, "Not authenticated");
            return false;
        }
        return true;
    }
}