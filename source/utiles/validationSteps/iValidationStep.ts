import {Response} from "express";
import {ErrorHandler} from "../errorHandler.ts";

export interface IValidationStep {
    execute(res: Response, route: string, errorHandler: ErrorHandler): Promise<boolean>;
}